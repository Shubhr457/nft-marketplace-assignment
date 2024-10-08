// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTSTORE is ERC721URIStorage {
    address payable public marketplaceOwner;
    uint256 public listingFeePercent = 20;
    uint256 private currentTokenId;
    uint256 private totalItemsSold;

    receive() external payable { }

    struct NFTListing {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    struct Offer {
        address payable offerer;
        uint256 price;
    }

    mapping (uint256 => NFTListing) private tokenIdToListing;
    mapping (uint256 => Offer[]) private tokenIdToOffers;

    event NFTListed(uint256 tokenId, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);
    event OfferMade(uint256 tokenId, address offerer, uint256 price);
    event OfferAccepted(uint256 tokenId, address offerer, uint256 price);
    event ListingCancelled(uint256 tokenId);

    modifier onlyOwner {
        require(msg.sender == marketplaceOwner, "Only owner can call this function");
        _;
    }

    modifier onlyTokenOwner(uint256 _tokenId) {
        require(msg.sender == tokenIdToListing[_tokenId].owner, "Only the token owner can call this function");
        _;
    }

    constructor() ERC721("NFTSTORE", "NFTS") {
        marketplaceOwner = payable(msg.sender);
    }

    function updateListingFeePercent(uint256 _listingFeePercent) public onlyOwner {
        listingFeePercent = _listingFeePercent;
    }

    function getListingFeePercent() public view returns (uint256) {
        return listingFeePercent;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return currentTokenId;
    }

    function getNFTListing(uint256 _tokenId) public view returns (NFTListing memory) {
        return tokenIdToListing[_tokenId];
    }

    function createToken(string memory _tokenURI, uint256 _price) public returns (uint256) {
        require(_price > 0, "Price must be greater than zero");

        currentTokenId++;
        uint256 newTokenId = currentTokenId;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        _createNFTListing(newTokenId, _price);

        emit NFTListed(newTokenId, _price);

        return newTokenId;
    }

    function _createNFTListing(uint256 _tokenId, uint256 _price) private {
        tokenIdToListing[_tokenId] = NFTListing({
            tokenId: _tokenId,
            owner: payable(msg.sender),
            seller: payable(msg.sender),
            price: _price,
            isListed: true
        });
    }

    function executeSale(uint256 _tokenId) public payable {
        NFTListing storage listing = tokenIdToListing[_tokenId];
        uint256 price = listing.price;
        address payable seller = listing.seller;

        require(listing.isListed, "NFT is not listed for sale");
        require(msg.value == price, "Please submit the asking price to complete the purchase");

        listing.seller = payable(msg.sender);
        listing.isListed = false;
        totalItemsSold++;

        _transfer(listing.owner, msg.sender, _tokenId);

        uint256 listingFee = (price * listingFeePercent) / 100;
        marketplaceOwner.transfer(listingFee);
        seller.transfer(msg.value - listingFee);

        emit NFTSold(_tokenId, msg.sender, price);
    }


    function makeOffer(uint256 _tokenId, uint256 _offerPrice) public payable {
        require(_offerPrice > 0, "Offer price must be greater than zero");
        require(tokenIdToListing[_tokenId].isListed, "NFT is not listed for sale");
        require(msg.value == _offerPrice, "Send enough amount");

        payable(address(this)).transfer(_offerPrice);

        tokenIdToOffers[_tokenId].push(Offer({
            offerer: payable(msg.sender),
            price: _offerPrice
        }));

        emit OfferMade(_tokenId, msg.sender, _offerPrice);
    }

    function amountInContract() public view returns (uint256){
        return address(this).balance;
    }

    function acceptOffer(uint256 _tokenId, uint256 _offerIndex) public {
        require(_offerIndex < tokenIdToOffers[_tokenId].length, "Invalid offer index");
        
        Offer memory offer = tokenIdToOffers[_tokenId][_offerIndex];
        NFTListing storage listing = tokenIdToListing[_tokenId];
        
        require(msg.sender == listing.seller, "Only seller can accept offer");
        require(address(this).balance >= offer.price, "Insufficient contract balance");

        address payable buyer = payable(offer.offerer);
        uint256 salePrice = offer.price;
        
        tokenIdToOffers[_tokenId][_offerIndex] = tokenIdToOffers[_tokenId][tokenIdToOffers[_tokenId].length - 1];
        tokenIdToOffers[_tokenId].pop();

        _transfer(listing.owner, buyer, _tokenId);

        payable(listing.seller).transfer(salePrice);

        for(uint256 i = 0; i < tokenIdToOffers[_tokenId].length; i++) {
            Offer memory otherOffer = tokenIdToOffers[_tokenId][i];
            payable(otherOffer.offerer).transfer(otherOffer.price);
        }

        delete tokenIdToOffers[_tokenId];

        emit OfferAccepted(_tokenId, buyer, salePrice);
    }

    function cancelListing(uint256 _tokenId) public onlyTokenOwner(_tokenId) {
        require(tokenIdToListing[_tokenId].isListed, "NFT is not listed for sale");

        tokenIdToListing[_tokenId].isListed = false;
        emit ListingCancelled(_tokenId);
    }

    function getOffers(uint256 _tokenId) public view returns (Offer[] memory) {
        return tokenIdToOffers[_tokenId];
    }

    function getAllListedNFTs() public view returns (NFTListing[] memory) {
        uint256 totalNFTCount = currentTokenId;
        NFTListing[] memory listedNFTs = new NFTListing[](totalNFTCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalNFTCount; i++) {
            uint256 tokenId = i + 1;
            NFTListing storage listing = tokenIdToListing[tokenId];
            if (listing.isListed) {
                listedNFTs[currentIndex] = listing;
                currentIndex += 1;
            }
        }

        return listedNFTs;
    }

    function getMyNFTs() public view returns (NFTListing[] memory) {
        uint256 totalNFTCount = currentTokenId;
        uint256 myNFTCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalNFTCount; i++) {
            if (tokenIdToListing[i + 1].owner == msg.sender || tokenIdToListing[i + 1].seller == msg.sender) {
                myNFTCount++;
            }
        }

        NFTListing[] memory myNFTs = new NFTListing[](myNFTCount);
        for (uint256 i = 0; i < totalNFTCount; i++) {
            if (tokenIdToListing[i + 1].owner == msg.sender || tokenIdToListing[i + 1].seller == msg.sender) {
                uint256 tokenId = i + 1;
                NFTListing storage listing = tokenIdToListing[tokenId];
                myNFTs[currentIndex] = listing;
                currentIndex++;
            }
        }

        return myNFTs;
    }
}

