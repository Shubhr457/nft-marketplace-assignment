const { expect } = require("chai");
const { ethers } = require("hardhat"); // Ensure this line is present

describe("NFTSTORE", function () {
    let NFTSTORE, nftStore, owner, addr1, addr2;

    beforeEach(async function () {
        NFTSTORE = await ethers.getContractFactory("NFTSTORE");
        [owner, addr1, addr2, _] = await ethers.getSigners();
        nftStore = await NFTSTORE.deploy(); // Deploy the contract
    });

    it("Should create an NFT and list it", async function () {
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1"); // Make sure ethers is correctly imported
        await nftStore.connect(addr1).createToken(tokenURI, price);

        const tokenId = await nftStore.getCurrentTokenId();
        const listing = await nftStore.getNFTListing(tokenId);

        expect(listing.tokenId).to.equal(tokenId);
        expect(listing.price).to.equal(price);
        expect(listing.isListed).to.equal(true);
    });

    it("Should allow a user to execute a sale", async function () {
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");
        await nftStore.connect(addr1).createToken(tokenURI, price);

        const tokenId = await nftStore.getCurrentTokenId();

        await nftStore.connect(addr2).executeSale(tokenId, { value: price });

        const newOwner = await nftStore.ownerOf(tokenId);
        const listing = await nftStore.getNFTListing(tokenId);

        expect(newOwner).to.equal(addr2.address);
        expect(listing.isListed).to.equal(false);
    });

    it("Should allow a user to make an offer on an NFT", async function () {
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");
        const offerPrice = ethers.parseEther("0.8");
        await nftStore.connect(addr1).createToken(tokenURI, price);

        const tokenId = await nftStore.getCurrentTokenId();
        await nftStore.connect(addr2).makeOffer(tokenId, offerPrice);

        const offers = await nftStore.getOffers(tokenId);

        expect(offers.length).to.equal(1);
        expect(offers[0].price).to.equal(offerPrice);
        expect(offers[0].offerer).to.equal(addr2.address);
    });

    // it("Should allow the owner to accept an offer", async function () {
    //     const tokenURI = "ipfs://token_uri";
    //     const price = ethers.parseEther("1");
    //     const offerPrice = ethers.parseEther("0.8");
    //     await nftStore.connect(addr1).createToken(tokenURI, price);

    //     const tokenId = await nftStore.getCurrentTokenId();
    //     await nftStore.connect(addr2).makeOffer(tokenId, offerPrice);

    //     await nftStore.connect(addr1).acceptOffer(tokenId, 0);

    //     const newOwner = await nftStore.ownerOf(tokenId);
    //     const listing = await nftStore.getNFTListing(tokenId);

    //     expect(newOwner).to.equal(addr2.address);
    //     expect(listing.isListed).to.equal(false);
    // });

    it("Should allow the owner to cancel a listing", async function () {
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");
        await nftStore.connect(addr1).createToken(tokenURI, price);

        const tokenId = await nftStore.getCurrentTokenId();
        await nftStore.connect(addr1).cancelListing(tokenId);

        const listing = await nftStore.getNFTListing(tokenId);
        expect(listing.isListed).to.equal(false);
    });

    it("Should allow the owner to update listing fee percent", async function () {
        const newListingFeePercent = 25;
        await nftStore.connect(owner).updateListingFeePercent(newListingFeePercent);

        const listingFeePercent = await nftStore.getListingFeePercent();
        expect(listingFeePercent).to.equal(newListingFeePercent);
    });

    it("Should restrict access to only the marketplace owner for updating listing fee", async function () {
        const newListingFeePercent = 25;
        await expect(
            nftStore.connect(addr1).updateListingFeePercent(newListingFeePercent)
        ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should restrict access to only the token owner for canceling listing", async function () {
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");
        await nftStore.connect(addr1).createToken(tokenURI, price);

        const tokenId = await nftStore.getCurrentTokenId();
        await expect(
            nftStore.connect(addr2).cancelListing(tokenId)
        ).to.be.revertedWith("Only the token owner can call this function");
    });

    it("Should fail to execute a sale with incorrect price", async function () {
        const tokenURI = "ipfs://token_uri";
        const price = ethers.parseEther("1");
        await nftStore.connect(addr1).createToken(tokenURI, price);

        const tokenId = await nftStore.getCurrentTokenId();
        const incorrectPrice = ethers.parseEther("0.5");

        await expect(
            nftStore.connect(addr2).executeSale(tokenId, { value: incorrectPrice })
        ).to.be.revertedWith("Please submit the asking price to complete the purchase");
    });
});
