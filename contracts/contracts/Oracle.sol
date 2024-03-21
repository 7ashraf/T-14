// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface NFTContract {
    function getContractIPFSHash(uint256 tokenId) external view returns (string memory);
    // Add other functions from the NFT contract as needed
}

contract Oracle is Ownable {
    // Address of the NFT contract
    address public nftContractAddress;
    
    // Mapping to store verified proposals
    mapping(uint256 => bool) public verifiedProposals;

    // Event emitted when a proposal is verified
    event ProposalVerified(uint256 indexed proposalId);

    constructor(address _nftContractAddress) Ownable(msg.sender) {
        nftContractAddress = _nftContractAddress;
    }

    // Function to set the address of the NFT contract
    function setNFTContractAddress(address _nftContractAddress) external onlyOwner {
        nftContractAddress = _nftContractAddress;
    }

    // Function to verify a proposal
    function verifyProposal(uint256 proposalId, uint256 tokenId) external onlyOwner {
        // Ensure the proposal hasn't been verified before
        require(!verifiedProposals[proposalId], "Proposal already verified");

        // Get the IPFS hash of the referenced contract from the NFT contract
        string memory ipfsHash = NFTContract(nftContractAddress).getContractIPFSHash(tokenId);

        // Additional validation can be added here, such as verifying the content of the referenced contract on IPFS

        // Mark the proposal as verified
        verifiedProposals[proposalId] = true;
        
        emit ProposalVerified(proposalId);
    }
}
