# NFTSTORE Smart Contract

## Overview

**NFTSTORE** is a Solidity smart contract that implements an NFT (Non-Fungible Token) marketplace on the Ethereum blockchain. The contract allows users to create, list, buy, make offers on, and sell NFTs. It is built using the ERC-721 standard, utilizing the OpenZeppelin library for secure and robust implementation.

## Features

- **NFT Creation**: Users can create their own NFTs with a specified URI and price.
- **Listing**: NFTs can be listed for sale on the marketplace with a defined price.
- **Buying**: Users can purchase listed NFTs by paying the specified price.
- **Offers**: Users can make offers on listed NFTs, which can be accepted by the NFT owner.
- **Cancelling Listings**: Owners can cancel their NFT listings.
- **Marketplace Fees**: The contract owner can set and collect a listing fee from each successful sale.

## Smart Contract Details

### Variables

- `marketplaceOwner`: Address of the marketplace owner who collects listing fees.
- `listingFeePercent`: Percentage of the sale price collected as a fee by the marketplace.
- `currentTokenId`: Counter for the total number of NFTs created.
- `totalItemsSold`: Counter for the total number of NFTs sold.
- `tokenIdToListing`: Mapping from token ID to the NFT listing details.
- `tokenIdToOffers`: Mapping from token ID to the list of offers made on that NFT.

### Structs

- **NFTListing**: Contains details about an NFT listing including token ID, owner, seller, price, and listing status.
- **Offer**: Contains details about an offer made on an NFT, including the offerer's address and price.

### Events

- `NFTListed(uint256 tokenId, uint256 price)`: Emitted when an NFT is listed for sale.
- `NFTSold(uint256 tokenId, address buyer, uint256 price)`: Emitted when an NFT is sold.
- `OfferMade(uint256 tokenId, address offerer, uint256 price)`: Emitted when an offer is made on an NFT.
- `OfferAccepted(uint256 tokenId, address offerer, uint256 price)`: Emitted when an offer is accepted.
- `ListingCancelled(uint256 tokenId)`: Emitted when an NFT listing is cancelled.

### Modifiers

- `onlyOwner`: Ensures that only the marketplace owner can call the function.
- `onlyTokenOwner`: Ensures that only the owner of a specified token ID can call the function.

### Functions

- **Constructor**
  - Initializes the contract, setting the deployer as the marketplace owner.

- **updateListingFeePercent(uint256 _listingFeePercent)**
  - Allows the marketplace owner to update the listing fee percentage.

- **getListingFeePercent()**
  - Returns the current listing fee percentage.

- **getCurrentTokenId()**
  - Returns the current token ID.

- **getNFTListing(uint256 _tokenId)**
  - Returns the details of a specific NFT listing.

- **createToken(string memory _tokenURI, uint256 _price)**
  - Mints a new NFT, sets its URI, and lists it for sale at the specified price.

- **executeSale(uint256 _tokenId)**
  - Allows a user to purchase a listed NFT by paying the asking price.

- **makeOffer(uint256 _tokenId, uint256 _offerPrice)**
  - Allows a user to make an offer on a listed NFT.

- **acceptOffer(uint256 _tokenId, uint256 _offerIndex)**
  - Allows the token owner to accept an offer on their listed NFT.

- **cancelListing(uint256 _tokenId)**
  - Allows the token owner to cancel the listing of their NFT.

- **getOffers(uint256 _tokenId)**
  - Returns the list of offers made on a specific NFT.

- **getAllListedNFTs()**
  - Returns a list of all currently listed NFTs on the marketplace.

- **getMyNFTs()**
  - Returns a list of all NFTs owned or listed by the caller.

## Installation and Deployment

1. **Install Dependencies**: Ensure you have Node.js, Hardhat, and the OpenZeppelin contracts installed.
   ```bash
   npm install
   ```

2. **Compile the Contract**:
   ```bash
   npx hardhat compile
   ```

3. **Deploy the Contract**: Update the deployment scripts and deploy to your preferred Ethereum testnet or mainnet.
   ```bash
   npx hardhat run scripts/deploy.js --network <network_name>
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For further inquiries or contributions, please reach out to the project maintainers.
