'use client'

import React from 'react'
import { useState, useEffect } from "react";
import { createHelia } from 'helia'

import { LandProposalForm } from '@/components/LandProposalForm'
import IpfsComponent from '@/components/ipfs';
import { subDaoContractAbi, subDaoContractAddress } from '../utils/constants';
import { unixfs } from '@helia/unixfs'
import { useWeb3 } from '../context/page';

const ethers = require("ethers");


function LandProposal() {

   // const [account, setAccount] = useState("");
    //const [signer, setSigner] = useState(null);
    //const [error, setError] = useState(null);
    //const [helia, setHelia] = useState(null)
    //const [subDaoContract, setSubDaoContract] = useState(null);
    // const [contractIPFSHash, setContractIPFSHash] = useState("");
    // const [imageIPFSHash, setImageIPFSHash] = useState("");
    const [fs , setFs] = useState(null)
    const {account,  signer, setError,  subDaoContract,  helia,} = useWeb3();
 

    const handleSubmit = async (e) => {
        e.preventDefault()

    const title = e.target.title.value;
    const location = e.target.location.value;
    const price = e.target.price.value;
    
    // console.log(title, location, price, e.target.contracts.files[0], e.target.images.files[0])
    // console.log(account)

    const contractIPFSHash = await uploadContract(e.target.contracts.files[0]);
    const imageIPFSHash = await uploadImage(e.target.images.files[0]);
    
    //const tx =  await createLandProposal(location, price, contractIPFSHash, imageIPFSHash);
    console.log(contractIPFSHash, imageIPFSHash)

    //await createLandProposal(location, price, contractIPFSHash, imageIPFSHash);

    await testTransaction();

    }

    const uploadContract = async (file) => {
        if (!helia) return;
        console.log("uploading contract image")

        const fileBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(fileBuffer);
        const cid = await fs.addBytes(bytes);
        //console.log(cid);
        return cid.toString();


    }

    const uploadImage = async (file) => {
        if (!helia) return;
        console.log("uploading land image")

        const fileBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(fileBuffer);
        const cid = await fs.addBytes(bytes);
        //console.log(cid);
        return cid.toString();

    }
    

    const createLandProposal = async (location, price, contractIPFSHash, imagesIPFSHash) => {
        if (!subDaoContract) {console.log("no dao "); setError("no contract"); await getSubDaoContract();}

        if(location === "" || price === "" || contractIPFSHash === "" || imagesIPFSHash === "") {
            console.log("missing fields")
            setError("Missing fields");
            return;
        }

        try {
            console.log("dao is creating proposal")
            //subDaoContract.connect(signer);
            //console.log(subDaoContract)
            console.log(account)
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
              });
              console.log("accountss", accounts)
            console.log(subDaoContract)
            const tx = await subDaoContract.createLandListingProposal("location", 200, "contractIPFSHash", "imagesIPFSHash");
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

    const getDaoContract = async () => {
        if (!account) return;
        try {
            const contract = new ethers.Contract(
                subDaoContractAddress,
                subDaoContractAbi,
                signer
            );
            setDaoContract(contract);
        } catch (error) {
            setError("Error getting contract" + error.message);
        }
    }

    const testTransaction = async () => {
        try {
            console.log("dao is creating proposal test")
            console.log(subDaoContract)
            console.log(signer)
            //await subDaoContract.connect(signer);
            const tx = await subDaoContract.createLandListingProposal("Cairo", 150000,"bafkreig5tsukx57ubiyhs7nntxulgtx5bgz5z5bapqd2t5uap3my2ba3xe " ,"bafkreig5tsukx57ubiyhs7nntxulgtx5bgz5z5bapqd2t5uap3my2ba3xe" );
            console.log(tx)
            await tx.wait();
            console.log("Proposal created");
        } catch (error) {
            setError("Error creating proposal" + error.message);
            console.log(error)
        }
    }




    useEffect(() => {
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
            
            
        //             const signer = await provider.getSigner();
        //             console.log(signer)
        //             setSigner(signer);
        //         } catch (error) {
        //             console.error(error);
        //         }
        //     }
        // };
        const fs = unixfs(helia);
        setFs(fs)

        // const init = async () => {
        //     if (helia) return
      
        //     const heliaNode = await createHelia()

        //     const fs = unixfs(heliaNode);
        //     setFs(fs)
      
        //     const nodeId = heliaNode.libp2p.peerId.toString()
        //     const nodeIsOnline = heliaNode.libp2p.status === 'started'
      
        //     setHelia(heliaNode)
        //     //setId(nodeId)
        //    // setIsOnline(nodeIsOnline)
        //   }
      
         // init()

        //   const getSubDaoContract = async () => {
        //     if(!account) return;
        //     if(!signer) return;
        //     try {
        //         console.log("getting sub dao contract")
        //         const contract = new ethers.Contract(subDaoContractAddress, subDaoContractAbi, signer);
        //         console.log(contract)
        //         setSubDaoContract(contract);
        //     } catch (error) {
        //       setError('Error getting contract' + error.message);
        //     }
          
          
        //   }

        

       // getAccount();
        //getDaoContract();
       // getSubDaoContract();
        console.log(helia)
    }, [account, helia, signer]);


  return (
    <div>
        {/* <IpfsComponent uploadFile={uploadFile}/> */}
        <LandProposalForm handleSubmit={handleSubmit} />
    </div>
  )
}

export default LandProposal