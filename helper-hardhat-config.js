const { subscribe } = require("diagnostics_channel");
const { ethers } = require("hardhat");

const networkConfig = {
  default: {
    name: "hardhat",
    keepersUpdateInterval: "30",
  },
  31337: {
    name: "localhost",
    blockConfirmations: 1,
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    entranceFee: ethers.utils.parseEther("0.01"),
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    subscriptionId: "588",
    keepersUpdateInterval: "30",
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
    interval: "30",
  },
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    vrfCoordinator: "0x90d3888cd5704612ef486731ee626f62dd67da7f",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000", // 0.01 ETH
    subscriptionId: "12145",
    interval: "30",
  },
};

const DECIMALS = 18;
const INITIAL_PRICE = "200000000000000000000";
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const developmentChains = ["hardhat", "localhost"];
module.exports = {
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
};
