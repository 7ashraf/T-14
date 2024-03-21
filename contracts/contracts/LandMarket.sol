// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Land.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandMarketplace is Ownable {
    Land public landNFTContract;

    struct LandOffer {
        address seller;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => LandOffer) public landOffers;

    event LandOffered(uint256 indexed tokenId, address indexed seller, uint256 price);
    event LandOfferCancelled(uint256 indexed tokenId);
    event LandBought(uint256 indexed tokenId, address indexed buyer,address seller, uint256 price);

    constructor(address _landNFTContract) Ownable(msg.sender) {
        landNFTContract = Land(_landNFTContract);
    }

    function offerLand(uint256 tokenId, uint256 price) external {
        require(landNFTContract.ownerOf(tokenId) == msg.sender, "You do not own this land");
        landOffers[tokenId] = LandOffer(msg.sender, price, true);
        landNFTContract.approve(address(this), tokenId);
        emit LandOffered(tokenId, msg.sender, price);
    }

    function cancelLandOffer(uint256 tokenId) external {
        require(landOffers[tokenId].seller == msg.sender, "You are not the seller");
        delete landOffers[tokenId];
        emit LandOfferCancelled(tokenId);
    }

    function buyLand(uint256 tokenId) external payable {
        LandOffer memory offer = landOffers[tokenId];
        require(offer.isActive, "Land is not for sale");
        require(msg.value >= offer.price, "Insufficient funds");
        address payable seller = payable(offer.seller);
        seller.transfer(msg.value);
        landNFTContract.safeTransferFrom(offer.seller, msg.sender, tokenId);
        emit LandBought(tokenId, msg.sender, offer.seller, offer.price);
        delete landOffers[tokenId];
    }
}
