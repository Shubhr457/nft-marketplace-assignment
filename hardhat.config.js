require("@nomicfoundation/hardhat-toolbox");
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
      url: "https://polygon-amoy.g.alchemy.com/v2/hXwE8n7cqsBK_9BwpPmlQ4nmTLh3t3Jd", // Replace with the actual Amoy testnet URL
      accounts: ["eedd5eed4e6aab6ae6987b0dd6e700890907e2ee21c080037430bfe44cdf82d7"] // Replace with your testnet account private key
    }
  },
  etherscan: {
    apiKey: "BDVG74Z27JY6P2BXAI6FNE3KFRI3GF76ZY",
    customChains: [
      {
        network: "amoy",
        chainId: 80002, // Replace with your chain ID
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com"
        }
      }
    ]
  }
  
};
