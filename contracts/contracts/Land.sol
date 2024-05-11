// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Lib.sol";
contract Land is ERC721 {
    uint256 private _tokenIds;

    mapping(uint256 => string) private _tokenURIs;
    
    mapping(uint256 => LandData) private _tokenMetadata;

    // IPFS base URI for storing pictures of land
    string private baseURI;
    constructor() ERC721("Land", "LAND") {baseURI = "baseuri";}



    struct LandData {
        address owner;
        string location;
        uint256 price;
        string proofOfLocation;
        string contractIPFSHash;
        string imagesIPFSHash;
    }
    function mintLand(address _to, Lib.LandListingProposal memory _proposal) external returns (uint256) {
        _tokenIds += 1;
        uint256 newTokenId = _tokenIds;

        _mint(_to, newTokenId);

        _setTokenURI(newTokenId, string(_proposal.contractIPFSHash));
        _setMetadata(newTokenId, _proposal.owner, _proposal.location, _proposal.price, _proposal.contractIPFSHash, _proposal.contractIPFSHash, _proposal.imagesIPFSHash);

        return newTokenId;
    }

    function _setMetadata(uint256 tokenId, address _owner, string memory _location, uint256 _price, string memory _proofOfLocation, string memory _contractIPFSHash, string memory _imagesIPFSHash) internal {
        LandData storage metadata = _tokenMetadata[tokenId];
        metadata.owner = _owner;
        metadata.location = _location;
        metadata.price = _price;
        metadata.proofOfLocation = _proofOfLocation;
        metadata.contractIPFSHash = _contractIPFSHash;
        metadata.imagesIPFSHash = _imagesIPFSHash;
    }


    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }

        // Override _baseURI function to return the base URI
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

        // Internal function to set metadata for a token


    // Function to retrieve metadata for a token
    function getMetadata(uint256 tokenId) external view returns (string memory, string memory, uint256) {
        LandData memory metadata = _tokenMetadata[tokenId];
        return (metadata.contractIPFSHash, metadata.location, metadata.price);
    }
}