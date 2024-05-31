"use client"
//import React from 'react'
import { Button, Card } from "flowbite-react";
// import { oracleContractAbi, oracleContractAddress } from './utils/constants.js';
import { useState, useEffect } from "react";
import Home from '../page';
import Link from 'next/link';
import { MyNavBar } from '@/components/NavBar';
import { useWeb3 } from '../context/page';
const ethers = require("ethers");


function page() {


  //const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);
  //const [oracleContract, setOracleContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const {account, oracleContract,} = useWeb3();


  const fetchAllProposals = async () => {
    //console.log(useWeb3())
    console.log(oracleContract)
    if (!oracleContract) return;

    try {
        const allProposals = await oracleContract.getAllProposals();

        const formattedData = allProposals.map(proposal => ({
          owner: proposal.owner,
                    
          price: proposal.price.toString(),
          location: proposal.location,
          contractIPFSHash: proposal.contractIPFSHash,
          imagesIPFSHash: proposal.imagesIPFSHash,
      
  }));
        setProposals(formattedData);
        console.log(formattedData);
    } catch (error) {
      console.log(error)
        setError("Error fetching proposals: " + error.message);
    

  }
}

  useEffect(() => {
    fetchAllProposals();
    //should use a context for account and provider, signer
    // const getAccount = async () => {
    //     if (window.ethereum) {
    //         try {
    //             const accounts = await window.ethereum.request({
    //                 method: "eth_requestAccounts",
    //             });
    //             setAccount(accounts[0]);
    //             const provider = new ethers.BrowserProvider(window.ethereum);
    //             await provider.send("eth_requestAccounts", []);
        
    //             setProvider(provider);
        
    //             const signer = await provider.getSigner();
    //             setSigner(signer);
    //             console.log(account)  
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // };



    // const getOracleContract = async () => {
    //     if (!account) return;
    //     try {
    //         const contract = new ethers.Contract(
    //             oracleContractAddress,
    //             oracleContractAbi,
    //             signer
    //         );
    //         setDaoContract(contract);
    //     } catch (error) {
    //         setError("Error getting contract" + error.message);
    //     }
    // }

    //getAccount();
    //getOracleContract();
  }, [account]);


  return (
    <div>
            <MyNavBar></MyNavBar>

      {proposals.map((proposal, index) => (
        <div>
          <Card  className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {proposal.location}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {proposal.price.toString()}
          </p>
          <Link color="blue" href={{
            pathname: '/Oracle/ProposalDetails',
            query: { id: 1, proposal: JSON.stringify(proposal)},
          
          }}  > <Button color="blue" ripple="light"> Read more</Button></Link>
          

        </Card>
        <br></br>

        </div>
      ))

      
      }



    </div>


    );
}

export default page