require("@nomicfoundation/hardhat-toolbox");

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
  }
};
