pragma solidity ^0.8.0;

library Lib {
    struct LandListingProposal{
        address owner;
        string location;
        uint256 price;
        string contractIPFSHash;
        string imagesIPFSHash;
    }
    enum ProposalStatus {PendingPaperValidation, PendingOwnershipTransferValidation, PendingImageVerfiers, Accepted, Rejected}
    // Mapping to store verified proposals
    //mapping(uint256 => bool) public verifiedProposals;

    // Event emitted when a proposal is verified
    event ProposalVerified(uint256 indexed proposalId);

    // Event emitted when a proposal is added
    event ProposalAdded(uint256 indexed proposalId, string location, uint256 price);

    // Event emitted when a proposal status is updated
    event ProposalStatusUpdated(uint256 indexed proposalId, ProposalStatus oldStatus, ProposalStatus newStatus);
}