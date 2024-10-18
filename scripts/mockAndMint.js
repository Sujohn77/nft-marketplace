const { ethers, network } = require("hardhat");

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
  const nftMarketplace = await ethers.getContractAt("NftMarketplace");
  const basicNft = await ethers.getContractAt("BasicNft");

  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId;
  console.log("Minted!");

  approveTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approveTx.wait(1);
  console.log("Approved!");

  await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);
  console.log("Listed!");
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
