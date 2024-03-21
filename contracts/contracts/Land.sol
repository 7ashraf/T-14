// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Land is ERC721 {
    uint256 private _tokenIds;

    mapping(uint256 => string) private _tokenURIs;
    // IPFS base URI for storing pictures of land
    string private baseURI;
    constructor(string memory _baseURI) ERC721("Land", "LAND") {baseURI = _baseURI;}

    function mintLand(address _to) external returns (uint256) {
        _tokenIds += 1;
        uint256 newTokenId = _tokenIds;
        _mint(_to, newTokenId);
        return newTokenId;
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
}