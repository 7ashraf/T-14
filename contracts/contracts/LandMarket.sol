// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Land.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Lib.sol";
contract LandMarketplace is Ownable {
    Land public landNFTContract;

    struct LandOffer {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }

        struct LandData {
        string location;
        uint256 price;
        bytes proofOfLocation;
        bytes contractIPFSHash;
        bytes imagesIPFSHash;
        uint256 tokenId;
    }

    address public daoAddress = address(0);

    modifier onlyDao {
        require(msg.sender == daoAddress, "Only DAO can call this function");
        _;
    }
    //TODO should be called market listing
    mapping(uint256 => LandOffer) public landOffers;
    LandOffer[] public landOffersArray;
    //TODO add list of land listings or ids

    event LandOffered(uint256 indexed tokenId, address indexed seller, uint256 price);
    event LandOfferCancelled(uint256 indexed tokenId);
    event LandBought(uint256 indexed tokenId, address indexed buyer,address seller, uint256 price);

    constructor(address _landNFTContract) Ownable(msg.sender) {
        landNFTContract = Land(_landNFTContract);
    }

    function offerLand(uint256 tokenId, uint256 price) external onlyDao {
        //require(landNFTContract.ownerOf(tokenId) == msg.sender, "You do not own this land"); //should be called by dao only
        // mint land and offer on market place
        landOffers[tokenId] = LandOffer(tokenId, msg.sender, price, true);
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

    function addListing(Lib.LandListingProposal memory _proposal) external {

        //mint land and offer on market place
        if(landNFTContract == Land(address(0))) {
            revert("Land NFT contract not set");
        }
        uint256 tokenId = landNFTContract.mintLand(_proposal.owner, _proposal);

        landOffers[tokenId] = LandOffer(tokenId, _proposal.owner, _proposal.price, true);
        landOffersArray.push(landOffers[tokenId]);
        
        landNFTContract.approve(address(this), tokenId);
        
        emit LandOffered(tokenId, msg.sender, _proposal.price);
    }

    function setLandNFTContract(address _landNFTContract) external onlyOwner {
        landNFTContract = Land(_landNFTContract);
    }

    // function getLandData(uint256 tokenId) external view returns (LandData memory) {
    //     LandData memory landData;
    //     Lib.LandListingProposal memory proposal = landNFTContract.getMetadata(tokenId);
    //     landData.location = proposal.location;
    //     landData.price = proposal.price;
    //     landData.proofOfLocation = proposal.proofOfLocation;
    //     landData.contractIPFSHash = proposal.contractIPFSHash;
    //     landData.imagesIPFSHash = proposal.imagesIPFSHash;
    //     landData.tokenId = tokenId;
    //     return landData;
    // }

    function getAllLandOffers() external view returns (LandOffer[] memory) {
        return landOffersArray;
    }

}
