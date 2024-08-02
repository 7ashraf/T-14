# Land Registration and Marketplace on Blockchain

## Overview

This project is a decentralized land registration and marketplace system built on blockchain technology. The application features a Main DAO component, a Sub-DAO component, and an Oracle for contract verification. The system ensures secure, transparent, and efficient property transactions, leveraging the power of blockchain and decentralized verification.

## Components

### Main DAO
The Main DAO (Decentralized Autonomous Organization) governs Sub-DAOs and ensures the overall governance of the system. It maintains a universal set of rules and policies applicable across all Sub-DAOs.

### Sub-DAO
Sub-DAOs are responsible for managing the land system within specific government jurisdictions. Members of Sub-DAOs must provide proof of location and undergo a Know Your Customer (KYC) verification process to ensure compliance with local laws.

### Oracle
The Oracle consists of verifiers who are responsible for validating physical land contracts for Sub-DAOs. Oracle verifiers must be located in the same region as the Sub-DAO and hold a lawyer's license to ensure legal compliance.

### Image Verifiers
Independent verifiers who provide proof of land location with images. They confirm the existence and accuracy of the land details provided by the users. Image verifiers are incentivized with a share of transaction tokens.

### IPFS Integration
All physical contract documentation is digitized and stored on the InterPlanetary File System (IPFS). IPFS offers a decentralized and efficient file storage solution, enhancing system decentralization and reducing single points of failure.

## Features

### Decentralized Authentication
Users register using a Web3 wallet and complete a KYC verification process. This eliminates the need for traditional passwords, enhancing privacy and security.

### Listing Properties
Verified users can list properties by submitting a proposal to the Sub-DAO, including details such as location, legal documents, and images. The proposal is verified by the Oracle before being accepted.

### Property Verification
The Oracle verifies land ownership and the authenticity of documents through official government channels. Verified proposals are moved to the next stage, where ownership is transferred to DAO members.

### Real-life Verification
Independent verifiers confirm the existence of the land by uploading real-life images and proof of location to the system. This step ensures the accuracy of the listed properties.

### Tokenization and Market Listing
Accepted proposals result in the tokenization of the property as a non-fungible token (NFT) on the blockchain. The property is then listed on the marketplace for potential buyers.

### Incentivized Participation
All actors in the system, including Oracle verifiers and real-life verifiers, are incentivized with a portion of transaction fees. They must lock in stakes to prevent fraud, ensuring a secure and trustless system.

## System Workflow

1. **User Registration:** Users connect their Web3 wallet and complete KYC verification.
2. **Proposal Submission:** Users submit property listing proposals to the Sub-DAO.
3. **Oracle Verification:** The Oracle verifies the legal documents and ownership of the property.
4. **Real-life Verification:** Independent verifiers confirm the physical existence of the property.
5. **Tokenization:** Verified properties are tokenized as NFTs and listed on the marketplace.
6. **Ownership Transfer:** The Sub-DAO handles legal transfer of ownership to the on-chain owner upon purchase.

## Benefits

- **Decentralization:** No single entity has control over the system, ensuring trustless and transparent operations.
- **Security:** Use of blockchain and IPFS ensures secure storage and management of property data.
- **Efficiency:** Automated verification processes reduce the time and cost associated with property transactions.
- **Scalability:** The system is designed to handle a large number of transactions and properties efficiently.

## Conclusion

This blockchain-based land registration and marketplace system provides a secure, transparent, and efficient platform for property transactions. By leveraging the power of DAOs, Oracles, and decentralized verification, the system ensures trustless operations and compliance with local laws.

