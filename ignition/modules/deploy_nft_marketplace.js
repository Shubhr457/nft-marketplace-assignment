async function main() {
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();
  
    await nftMarketplace.deployed();
  
    console.log("NFT Marketplace contract deployed to:", nftMarketplace.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  