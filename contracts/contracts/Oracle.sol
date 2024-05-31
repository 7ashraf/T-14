// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Lib.sol";
import "./Dao.sol";

interface NFTContract {
    function getContractIPFSHash(uint256 tokenId) external view returns (string memory);
    // Add other functions from the NFT contract as needed
}

contract Oracle is Ownable {
    // Address of the NFT contract
    address public nftContractAddress;
    //address public daoContractAddress;
    SubDAOContract public subDaoContractAddress;


    // Proposal ID
    uint256 public proposalId;

    // struct LandListingProposal{
    //     address owner;
    //     string location;
    //     uint256 price;
    //     bytes contractIPFSHash;
    //     bytes imagesIPFSHash;
    // }
    mapping (uint256 => Lib.LandListingProposal) public landListingProposals;
    Lib.LandListingProposal[] public landListingProposalsArray;
    uint[] public proposalIds;

    mapping (uint256 => ProposalStatus)      public proposalStatus;

    enum ProposalStatus {PendingPaperValidation, PendingOwnershipTransferValidation, PendingImageVerfiers, Accepted, Rejected}
    // Mapping to store verified proposals
    mapping(uint256 => bool) public verifiedProposals;

    // Event emitted when a proposal is verified
    event ProposalVerified(uint256 indexed proposalId);

    // Event emitted when a proposal is added
    event ProposalAdded(uint256 indexed proposalId, string location, uint256 price);

    // Event emitted when a proposal status is updated
    event ProposalStatusUpdated(uint256 indexed proposalId, ProposalStatus oldStatus, ProposalStatus newStatus);

    constructor( ) Ownable(msg.sender) {
    }

    // Function to set the address of the NFT contract
    function setNFTContractAddress(address _nftContractAddress) external  {
        nftContractAddress = _nftContractAddress;
    }

    // Function to set the address of the DAO contract
    // function setDAOContractAddress(address _daoContractAddress) external  {
    //     daoContractAddress = _daoContractAddress;

    // }

    function setSubDAOContractAddress(address _subDaoContractAddress) external  {
        //subDaoContractAddress = _subDaoContractAddress;
        subDaoContractAddress = SubDAOContract(_subDaoContractAddress);

    }

    // Function to verify a proposal
    // missing modifier
    function verifyStep(uint256 _proposalId, ProposalStatus _verfiedStep) external  {
        // Ensure the proposal hasn't been verified before
        require(!verifiedProposals[proposalId], "Proposal already verified");

        // Update the proposal status
        ProposalStatus newStatus;
        if(_verfiedStep == ProposalStatus.PendingPaperValidation){
            newStatus = ProposalStatus.PendingOwnershipTransferValidation;
            proposalStatus[_proposalId] = newStatus;
        }else if(_verfiedStep == ProposalStatus.PendingOwnershipTransferValidation){
            newStatus = ProposalStatus.PendingImageVerfiers;
            proposalStatus[_proposalId] = newStatus;

        }else if(_verfiedStep == ProposalStatus.PendingImageVerfiers){
            newStatus = ProposalStatus.Accepted;
            proposalStatus[_proposalId] = newStatus;

            //call dao and set accepted
            if(subDaoContractAddress == SubDAOContract( address(0))) {
                revert("SubDAO contract address not set");
            }
            subDaoContractAddress.acceptProposal(_proposalId);
        }else{
            revert("Invalid step");
        }

        
        emit ProposalStatusUpdated(proposalId, _verfiedStep, newStatus);
    }

    function rejectProposal(uint256 _proposalId) external onlyOwner {
        // Ensure the proposal hasn't been verified before
        require(!verifiedProposals[proposalId], "Proposal already verified");

        // Update the proposal status
        proposalStatus[_proposalId] = ProposalStatus.Rejected;

        // Mark the proposal as verified
        verifiedProposals[_proposalId] = true;

        //call dao and apply penalty


        // Emit an event
        emit ProposalVerified(_proposalId);
    }
    //boilerplate code between dao and oracle, need better architecture

    function addProposal(Lib.LandListingProposal calldata _proposal) external {
        // Add the proposal to the mapping
        landListingProposals[proposalId] = _proposal;
        proposalStatus[proposalId] = ProposalStatus.PendingPaperValidation;
        proposalIds.push(proposalId);
        proposalId++;
        landListingProposalsArray.push(_proposal);

        //emit an event
        emit ProposalAdded(proposalId, _proposal.location, _proposal.price);

    }

    function getAllProposals() external view returns (Lib.LandListingProposal[] memory) {
        return landListingProposalsArray;
    }

    function getProposal(uint256 _proposalId) external view returns (Lib.LandListingProposal memory) {
        return landListingProposals[_proposalId];
    }
}
