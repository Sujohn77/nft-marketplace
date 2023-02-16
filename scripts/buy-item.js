const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");
const TOKEN_ID = 35;

async function buyItem() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");
  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
  const price = listing.price.toString();
  console.log("PRICE:", price);
  const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait(1);
  console.log("NFT bought!");
  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    await moveBlocks(1, (sleepAmount = 1000));
  }
}

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
