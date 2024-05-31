// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing necessary libraries
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Oracle.sol";
import "./LandMarket.sol";
import "./Lib.sol";

// Main DAO contract
contract MainDAO is Ownable {

    LandMarketplace public landMarket;
    struct SubDAO {
        address subDAOAddress;
        string name;
        string location;
    }


    struct DaoProposal {
        address proposer;
        string location;
        bytes proofOfLocation;
        bytes proofOfIndentity;
        bool accepted;
    }

    mapping(address => DaoProposal) public daoProposals;

    mapping(address => SubDAO) public subDAOs;

    event SubDAOCreated(address indexed subDAOAddress, string name);
    event daoProposalCreated(address indexed proposer, string location, bytes proofOfLocation, bytes proofOfIndentity);

    address public oracleAddress = address(0);
    Oracle public oracleContract;

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Only oracle can call this function");
        _;
    }

    constructor( ) Ownable(msg.sender) {

    }

    function setOracleAddress(address _oracleAddress) external onlyOwner {
        oracleAddress = _oracleAddress;
        oracleContract = Oracle(_oracleAddress);
    }

    function createSubDAO(string memory _name, string memory _location) public onlyOwner  {
        SubDAOContract subDAO = new SubDAOContract(_name, _location);
        address subDaoAddress = address(subDAO);
        
        subDAOs[subDaoAddress] = SubDAO(subDaoAddress, _name, _location);
        
        // Emit an event
        emit SubDAOCreated(subDaoAddress, _name);
    }

    function createDaoProposal(string memory _location, bytes memory _proofOfLocation, bytes memory proofOfIndentity) external {
        daoProposals[msg.sender] = DaoProposal(msg.sender, _location, _proofOfLocation, proofOfIndentity, false);
        // Oracle will verify the proof of location and identity
        emit daoProposalCreated(msg.sender, _location, _proofOfLocation, proofOfIndentity);
    }

    function acceptDaoProposal(address _proposer) external  {
        // to be called by the oracle
        daoProposals[_proposer].accepted = true;
        DaoProposal memory daoProposal  = daoProposals[_proposer];
        createSubDAO("daoProposal.name", "daoProposal.location");
    }

    
}

// Sub-DAO contract
contract SubDAOContract  {
    //TODO getters
    // State variables
    string public name;
    string public location;

    LandMarketplace public landMarket;


    // struct LandListingProposal{
    //     address owner;
    //     string location;
    //     uint256 price;
    //     bytes contractIPFSHash;
    //     bytes imagesIPFSHash;
    // }
    address public oracleAddress = address(0);
    Oracle public oracleContract;

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Only oracle can call this function");
        _;
    }

    uint public proposalId;

    mapping(uint256 => Lib.LandListingProposal) public landListingProposals;
    mapping(address => Lib.LandListingProposal[]) public userLandListingProposals;

    //store status inside proposal struct
    mapping (uint256 => ProposalStatus) public proposalStatus;

    enum ProposalStatus {Pending, Accepted, Rejected}

    event LandListingProposalCreated(uint256 indexed proposalId, string location, uint256 price);
    event LandListingProposalVerified(uint256 indexed proposalId);
    // Constructor to set the sub-DAO's name
    constructor(string memory _name, string memory _location) {
        name = _name;
        location = _location;
    }

    function setOracleAddress(address _oracleAddress) external {
        oracleAddress = _oracleAddress;
        oracleContract = Oracle(_oracleAddress);
    }

    function setLandMarketAddress(address _landMarketAddress) external {
        landMarket = LandMarketplace(_landMarketAddress);
    }

    function joinDaoRequest(bytes calldata proofOfLocation, bytes calldata proofOfIdentity) external {
        // Add the user to the DAO
        //Oracle will verify the proof of location and identity

    }
    // function to create a proposal for land listing
    //difference between memory and calldata
    function createLandListingProposal( 
        string calldata location,
        uint256 price,
        string calldata contractIPFSHash,
        string calldata imagesIPFSHash
        ) external {
        // Create a proposal for listing a land NFT
        Lib.LandListingProposal memory proposal = Lib.LandListingProposal(msg.sender, location, price, contractIPFSHash, imagesIPFSHash);
        // Add the proposal to the list of proposals
        
        landListingProposals[proposalId] = proposal;
        proposalStatus[proposalId] = ProposalStatus.Pending;
        proposalId++;

        // Add the proposal to the user's list of proposals
        userLandListingProposals[msg.sender].push(proposal);

        // Emit an event
        emit LandListingProposalCreated(proposalId, location, price);

        //Notify oracle of the new proposal
        oracleContract.addProposal(proposal);
    }

    //function to be called by oracle once the land is verified
    function verifyLandListingProposal(uint256 _proposalId) external  {
        // Update the proposal status
        proposalStatus[_proposalId] = ProposalStatus.Accepted;
        // call land market and add listing + notify user
        //LandMarket.addListing(landListingProposals[_proposalId]);
        // Emit an event
        emit LandListingProposalVerified(_proposalId);
    }

    function acceptProposal(uint256 _proposalId) external {
        // to be called by the oracle
        proposalStatus[_proposalId] = ProposalStatus.Accepted;
        // call land market and add listing + notify user
        if (landMarket == LandMarketplace(address(0))) {
            revert("LandMarket address not set");
        }
        landMarket.addListing(landListingProposals[_proposalId]);
        // Emit an event
        emit LandListingProposalVerified(_proposalId);
    }

    function getUserLandListingProposals(address _user) external view returns(Lib.LandListingProposal[] memory) {
        return userLandListingProposals[_user];
    }
}
