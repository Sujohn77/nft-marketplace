const {
  backendContractsFile,
  backendContractsFile2,
  backendAbiLocation,
  frontendAbiLocation,
  frontendContractsFile,
} = require("../helper-hardhat-config");
require("dotenv").config();
const fs = require("fs");
const { network } = require("hardhat");

const path = require("path");

module.exports = async () => {
  if (process.env.UPDATE_BACKEND) {
    console.log("Writing to backend abi...");
    await updateContractAddresses();
    await updateAbi();
    console.log("Backend abi files are updated!");
  }
};

async function updateAbi() {
  // Specify the contract name and the ABI destination directory
  const contractNames = ["BasicNft", "NftMarketplace"];

  let index = 0;
  while (index < contractNames.length) {
    try {
      // Get the path to the contract's ABI in the artifacts folder
      const abiFilePath = path.join(
        __dirname,
        `../artifacts/contracts/${contractNames[index]}.sol/${contractNames[index]}.json`
      );

      // Read the compiled contract JSON file
      const contractJson = await fs.readFileSync(abiFilePath, "utf8");

      // Extract the ABI
      const abi = JSON.parse(contractJson).abi;

      // Write the ABI to a JSON file in the backend folder
      const backOutputPath = path.join(
        backendAbiLocation,
        `${contractNames[index]}.json`
      );

      const frontOutputPath = path.join(
        frontendAbiLocation,
        `${contractNames[index]}.json`
      );

      fs.writeFileSync(backOutputPath, JSON.stringify(abi));
      fs.writeFileSync(frontOutputPath, JSON.stringify(abi));

      console.log(`ABI for ${contractNames[index]} saved to ${backOutputPath}`);
      index++;
    } catch (error) {
      console.error("Error exporting ABI:", error);
      index++;
    } finally {
    }
  }
}

async function updateContractAddresses() {
  const chainId = network.config.chainId.toString();
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const nft = await ethers.getContract("basicNft");
  const contractAddresses = JSON.parse(
    fs.readFileSync(backendContractsFile, "utf8")
  );

  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NftMarketplace"].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = {
      ...contractAddresses[chainId],
      NftMarketplace: [nftMarketplace.address],
    };
  }

  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId]["BasicNft"].includes(nft.address)) {
      contractAddresses[chainId]["BasicNft"].push(nft.address);
    }
  } else {
    contractAddresses[chainId] = {
      ...contractAddresses[chainId],
      BasicNft: [nft.address],
    };
  }

  fs.writeFileSync(backendContractsFile, JSON.stringify(contractAddresses));
  fs.writeFileSync(frontendContractsFile, JSON.stringify(contractAddresses));
}
module.exports.tags = ["all", "backend"];
