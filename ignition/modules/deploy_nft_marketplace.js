const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const NFTStore = await hre.ethers.getContractFactory("NFTSTORE");
    const nftStore = await NFTStore.deploy();
    
    await nftStore.waitForDeployment();

    console.log("NFTStore deployed to:", nftStore.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
