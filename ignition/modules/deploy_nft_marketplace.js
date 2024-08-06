async function main() {
    const NFTStore = await ethers.getContractFactory("NFTSTORE");
    const nftStore = await NFTStore.deploy();
    console.log("NFTStore deployed to:", nftStore.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
