const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const NFT = await hre.ethers.getContractFactory("MyNFT");
    const nft = await NFT.deploy();
    
    // Wait for the contract to be deployed
    await nft.waitForDeployment();

    console.log("NFT contract deployed to:", nft.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
