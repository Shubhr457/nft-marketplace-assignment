async function main() {
    const NFT = await ethers.getContractFactory("MyNFT");
    const nft = await NFT.deploy();
  
    // await nft.deployed();
    //console.log("nft",nft)

     await run("verify:verify", {
    address: MyNFT.address,
    constructorArguments: [],
  });
}
  
    console.log("NFT contract deployed to:", nft.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
