// Importing necessary libraries
const Web3 = require('web3');
const { abi } = require('./MyContractABI.json'); // Import ABI of the smart contract
const { ethers } = require('ethers'); // For Ethereum transaction signing
const axios = require('axios');

// Initializing Web3 with Infura provider
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Initializing contract instance
const contractAddress = '0x123abc...'; // Address of oracle contract
const contract = new web3.eth.Contract(abi, contractAddress);

// Function to listen for events from the oracle contract
async function listenForEvents() {
    contract.events.ProposalAdded({}, async (error, event) => {
        if (error) {
            console.error('Error:', error);
            return;
        }




        console.log('Proposal added  received:', event.returnValues);

        //send verification request to the verifiers application



        // Fetch Ethereum price from an external API
        //const ethPrice = await fetchEthPrice();

        // Send Ethereum price back to the smart contract
        //await sendEthPriceToContract(ethPrice, event.returnValues.requestId);
    });

    contract.events.ProposalStatusUpdated({}, async (error, event) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        
        console.log('Proposal Status updated:', event.returnValues);

        //call the verifiers application to update the status of the proposal for oracle verifiers app

    });
}

// Function to fetch Ethereum price from an external API
// async function fetchEthPrice() {
//     try {
//         const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
//         const response = await axios.get(apiUrl);
//         const ethPrice = response.data.ethereum.usd;
//         console.log('Fetched Ethereum price:', ethPrice);
//         return ethPrice;
//     } catch (error) {
//         console.error('Error fetching Ethereum price:', error.message);
//         throw error;
//     }
// }

// Function to send Ethereum price back to the smart contract

// async function sendEthPriceToContract(ethPrice, requestId) {
//     try {
//         // Assuming that you have the private key of the account used to deploy the contract
//         const privateKey = 'YOUR_PRIVATE_KEY';
//         const signer = new ethers.Wallet(privateKey, web3.currentProvider);

//         // Constructing transaction
//         const transaction = {
//             to: contractAddress,
//             data: contract.methods.receiveEthPrice(requestId, ethPrice).encodeABI(),
//             gasLimit: '500000', // Adjust gas limit as needed
//             gasPrice: await web3.eth.getGasPrice(),
//             nonce: await web3.eth.getTransactionCount(signer.address)
//         };

//         // Signing and sending transaction
//         const signedTx = await signer.signTransaction(transaction);
//         const txHash = await web3.eth.sendSignedTransaction(signedTx);
//         console.log('Transaction sent:', txHash);
//     } catch (error) {
//         console.error('Error sending transaction:', error.message);
//         throw error;
//     }
// }

// Start listening for events



listenForEvents()
    .then(() => console.log('Listening for events...'))
    .catch(error => console.error('Error starting listener:', error));
