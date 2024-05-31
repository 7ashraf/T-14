"use client";
import React from 'react'
import { useState, useEffect } from "react";
const ethers = require("ethers");
import {  subDaoContractAbi, subDaoContractAddress } from '../utils/constants.js';
import { MyNavBar } from '@/components/NavBar';
import LandProposal from '../LandProposal/page.js';
import { Button } from '@material-tailwind/react';
import { useWeb3 } from '../context/page.js';
import { Card } from 'flowbite-react';

function page() {

    const [provider, setProvider] = useState(null);
    //const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [landContract, setLandContract] = useState(null);
    const[signer, setSigner] = useState(null);
    //const [daoContract, setDaoContract] = useState(null);
    const [userProposals, setUserProposals] = useState([]);
    const {account, setAccount, daoContract, subDaoContract} = useWeb3();
    console.log("ctx works", useWeb3())
    const testTransaction = async () => {
        try {
            console.log("dao is creating proposal")
            console.log(daoContract)
            daoContract.connect(signer)
            const tx = await daoContract.createLandListingProposal("location", 100, "contractIPFSHash", "imagesIPFSHash");
            console.log(tx)
            await tx.wait();
            console.log("Proposal created");
            return tx;
        } catch (error) {
            setError("Error creating proposal" + error.message);
            console.log(error)
            return error;
        }
    }

    useEffect(() => {
        //should use a context for account and provider, signer
        //commented due to context
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

        // work in ctx
        // const getDaoContract = async () => {
        //     if (!account) return;
        //     try {
        //         const Myprovider = new ethers.BrowserProvider(window.ethereum);
        //         await Myprovider.send("eth_requestAccounts", []);

        //         console.log("getting dao contract")
        //         const contract = new ethers.Contract(
        //             subDaoContractAddress,
        //             subDaoContractAbi,
        //             signer
        //         );
        //         setDaoContract(contract);
        //     } catch (error) {
        //         setError("Error getting dao contract: " + error.message);
        //     }
        // };

        const getUserProposals = async () => {
            console.log("attempting to get user proposals")
            if (!daoContract) return;
            console.log("getting user proposals")
            try {
                //const proposalIds = await daoContract.getUserProposals();
                const userProposals = await subDaoContract.getUserLandListingProposals(account);
                console.log("found")
                console.log("user proposals: ", userProposals);
           
                const formattedData = userProposals.map(proposal => ({
                    
                        price: proposal.price.toString(),
                        location: proposal.location,
                        contractIPFSHash: proposal.contractIPFSHash,
                        imagesIPFSHash: proposal.imagesIPFSHash,
                    
                }));
                console.log(userProposals[0].location)
                console.log(formattedData)
                setUserProposals(formattedData);
                console.log("user proposals formatted: ", userProposals);
            } catch (error) {
                setError("Error fetching proposals: " + error.message);
            }
        }
    
    
    

    
        //getAccount();
        //getDaoContract();
        getUserProposals();
      }, [account ]);





  return (
    <div>
        <MyNavBar />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Proposals</h1>
        <div>
            {userProposals.map((proposal, index) => {
                return (
                    <div key={index}>
                        
                        
                        <Card  className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {proposal.location}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {proposal.price.toString()}
          </p>
          <h2>{proposal.contractIPFSHash}</h2>
                        <h2>{proposal.imagesIPFSHash}</h2>
  
          

        </Card>
                        <br />
                    </div>
                );
            })}
        </div>

        <div>

        <br></br>

        </div>
        <div>
            { <LandProposal /> }

        </div>

    </div>
  )
}

export default page