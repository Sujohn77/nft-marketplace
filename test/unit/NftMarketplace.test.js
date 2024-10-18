const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NftMarketplace Unit Tests", function () {
      let accounts, deployer, nftMarketplace, basicNft;

      const PRICE = ethers.utils.parseEther("0.01");
      const TOKEN_ID = 0;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        player = accounts[1];
        await deployments.fixture(["all"]);

        nftMarketplace = await ethers.getContract("NftMarketplace");
        basicNft = await ethers.getContract("BasicNft");
        await basicNft.mintNft();
      });

      describe("list item", function () {
        it("lists item and can be bought", async () => {
          await basicNft.approve(nftMarketplace.address, TOKEN_ID);
          nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          const nftMarketplaceWithConnectedPlayer =
            nftMarketplace.connect(player);
          await nftMarketplaceWithConnectedPlayer.buyItem(
            basicNft.address,
            TOKEN_ID,
            { value: ethers.utils.parseEther("0.01") },
          );
          const newOwner = await basicNft.ownerOf(TOKEN_ID);
          const deployerProceeds = await nftMarketplace.getProceeds(
            deployer.address,
          );
          assert.equal(newOwner.toString(), player.address);
          assert.equal(deployerProceeds.toString(), PRICE.toString());
        });

        it("exclusively allows owner to list", async () => {
          await basicNft.approve(nftMarketplace.address, TOKEN_ID);
          const nftMarketplaceWithConnectedPlayer =
            nftMarketplace.connect(player);

          await expect(
            nftMarketplaceWithConnectedPlayer.listItem(
              basicNft.address,
              TOKEN_ID,
              PRICE + 1,
            ),
          ).to.be.revertedWith("NotOwner");
        });
        it("allows to list approved nft", async () => {
          await expect(
            nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE),
          ).to.be.revertedWith("NftMarketplace__NotApprovedForMarketPlace");
        });
        it("allows to list not listed nft", async () => {
          await basicNft.approve(nftMarketplace.address, TOKEN_ID);
          const error = `NftMarketplace__AlreadyListed("${basicNft.address}", ${TOKEN_ID})`;
          nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          await expect(
            nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE),
          ).to.be.revertedWith(error);
        });
      });

      describe("update item", () => {
        it("updates listing and emits event", async () => {
          await basicNft.approve(nftMarketplace.address, TOKEN_ID);
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          expect(
            await nftMarketplace.updateListing(
              basicNft.address,
              TOKEN_ID,
              PRICE + 1,
            ),
          )
            .to.emit(nftMarketplace, "ItemUpdated")
            .withArgs(
              (deployer.address, basicNft.address, TOKEN_ID, PRICE + 1),
            );
        });
      });

      describe("withdrawProceeds", function () {
        beforeEach(async () => {
          await basicNft.approve(nftMarketplace.address, TOKEN_ID);
        });

        it("doesn't allow 0 proceed withdrawls", async function () {
          await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
            "NoProceeds",
          );
        });
        it("withdraws proceeds", async function () {
          //  List
          nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          // Buy item
          nftMarketplace = nftMarketplace.connect(player);
          await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
            value: PRICE,
          });
          nftMarketplace = nftMarketplace.connect(deployer);

          const deployerBalanceBefore = await deployer.getBalance();
          const deployerProceedsBefore = await nftMarketplace.getProceeds(
            deployer.address,
          );

          const txResponse = await nftMarketplace.withdrawProceeds();
          const transactionReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const deployerBalanceAfter = await deployer.getBalance();

          assert(
            deployerBalanceAfter.add(gasCost).toString() ===
              deployerBalanceBefore.add(deployerProceedsBefore).toString(),
          );
        });
      });
    });
