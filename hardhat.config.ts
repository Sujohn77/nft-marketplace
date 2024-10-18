require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const HARDHAT_PRIVATE_KEY = process.env.HARDHAT_PRIVATE_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

const config = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
      },
    ],
  },

  defaultNetwork: "hardhat",
  gas: 210000000,
  gasPrice: 470000000000,
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/d4IzVhyemV_Cudwhf-OarCOp6n691F3D",
      accounts: [PRIVATE_KEY!],
      chainId: 11155111,
    },
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false,
  },

  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.SEPLIA_ETHERSCAN_API_KEY,
    },
    customChains: [],
    enabled: true,
  },
  gasReporter: {
    currency: "USD",
    enabled: true,
    noColors: true,
    gasPriceApi: `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apiKey=${process.env.ETHERSCAN_API_KEY}`,
    outputFile: "gas-reporter.txt",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  contractSizer: {
    runOnCompile: false,
    only: ["NftMarketplace"],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 200000,
  },
};

export default config;
