require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
//require('@nomiclabs/hardhat-etherscan');
//require("@nomiclabs/hardhat-waffle");
//require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
 networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL, 
      accounts: [process.env.PRIVATE_KEY] 
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: 'CEZZEM3C6PSHKYD6HDKP8A63PRN9TVWPD9'
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        },
      }
    ]
  },
  
};
