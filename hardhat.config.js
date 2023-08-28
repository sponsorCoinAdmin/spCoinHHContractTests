require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  solidity: {
    version:  "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      }
    }
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_ALCHEMY_RPC_TESTNET,
      accounts: [process.env.GOERLI_ACCOUNT_1_PRIVATE_KEY]
  },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_TEST_URL,
      accounts: [process.env.SEPOLIA_ACCOUNT_3_PRIVATE_KEY]
  }
},
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: ["SPCoin"],
  }
};
