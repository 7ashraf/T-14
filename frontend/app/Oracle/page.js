"use client"
import React from 'react'
import { Button, Card } from "flowbite-react";
// import { oracleContractAbi, oracleContractAddress } from './utils/constants.js';
import { useState, useEffect } from "react";
import Home from '../page';
import Link from 'next/link';
import { MyNavBar } from '@/components/NavBar';
const ethers = require("ethers");


function Oracle() {


  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);
  const [oracleContract, setOracleContract] = useState(null);
  const [proposals, setProposals] = useState([]);

  const fetchAllProposals = async () => {
    if (!oracleContract) return;

    try {
        const proposalIds = await oracleContract.getAllProposals();
        for (let i = 0; i < proposalIds.length; i++) {
            const proposal = await oracleContract.getProposal(proposalIds[i]);
            setProposals([...proposals, proposal]);
        }
        console.log(proposals);
    } catch (error) {
        setError("Error fetching proposals: " + error.message);
    

  }
}

  useEffect(() => {
    //should use a context for account and provider, signer
    const getAccount = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(accounts[0]);
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
        
                setProvider(provider);
        
                const signer = await provider.getSigner();
                setSigner(signer);
                console.log(account)  
            } catch (error) {
                console.error(error);
            }
        }
    };



    const getOracleContract = async () => {
        if (!account) return;
        try {
            const contract = new ethers.Contract(
                oracleContractAddress,
                oracleContractAbi,
                signer
            );
            setDaoContract(contract);
        } catch (error) {
            setError("Error getting contract" + error.message);
        }
    }

    getAccount();
    getOracleContract();
  }, [account]);


  return (
    <div>
      <MyNavBar></MyNavBar>
  <Card  className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Noteworthy technology acquisitions 2021
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
      <Link href={{
        pathname: '/Oracle/ProposalDetails',
        query: { id: 1 },
      
      }} color='blue' >Open Proposal</Link>
      <Button color="blue" ripple="light"> Read more</Button>
    </Card>
    </div>


    );
}

export default Oracle