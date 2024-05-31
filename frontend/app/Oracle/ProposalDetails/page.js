"use client"
import { useWeb3 } from '@/app/context/page';
import { subDaoContractAbi } from '@/app/utils/constants';
import { MyNavBar } from '@/components/NavBar';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import { Card, Button } from "flowbite-react";

function OracleDetails({searchParams}) {
    const [proposalId, setProposalId] = useState(null);
    const [error, setError] = useState(null);
    const [proposal, setProposal] = useState(null);
    const {account, oracleContract, subDaoContract, landNftContract, landMarketContract} = useWeb3();


    useEffect(() => {

        const fetchProposal = async (id) => {
            if(!oracleContract) return;
            try{
                console.log(oracleContract)
                const proposal = await oracleContract.getProposal(searchParams.id);
                console.log(proposal)
                //setProposal(proposal);
            }catch(error){
                console.log(error)
                setError('Error fetching proposal: ' + error.message);
            }
        }
        
        // fetch proposal details
        //setProposal(searchParams.id)
        fetchProposal(proposalId)

        const data = JSON.parse(searchParams.proposal)
        console.log(data)
        setProposal(data)

        console.log(searchParams)

    }, [])

    const verifyStep = async () => {
        // verify step
        try{
            const oracleStatus = await oracleContract.proposalStatus(searchParams.id);
            console.log(oracleStatus)
            //await landNftContract.mintLand(account, proposal)
            const tx = await landNftContract.setApprovalForAll(landMarketContract, true);
            await tx.wait();
            await landMarketContract.addListing(proposal);
            await oracleContract.verifyStep(searchParams.id, 2, { gasLimit:30000000 });
            setError(null);
        }catch(error){
            console.log(error)
            
            setError('Error verifying step: ' + error.message);
        }
    }

    const skipVerify = async () => {

        try{
            console.log((await subDaoContract.landMarket()))
            console.log((await landMarketContract.landNFTContract()))
            console.log(searchParams.id)
            console.log(subDaoContract != null)
            const increaseGasLimit = (estimatedGasLimit) => {
                return estimatedGasLimit.mul(130).div(100) // increase by 30%
              }
            //const estimatedGas = await subDaoContract.estimateGas.acceptProposal(1)
            const tx = await subDaoContract.acceptProposal(1)
            //((await subDaoContract.acceptProposal(searchParams.id)))

        }catch(error){
            console.log(error)
            setError('Error skipping verification: ' + error.message);
        }

    }

    const mockVerify = async () => {
    }

    if(!proposal){
        return <div>Loading...</div>
    }

  return (
    <div>
        <MyNavBar></MyNavBar>

        {/* {owmner, location, Price, contract ipfs images, land images, pending step, cta verify} */}
        <p></p>
       
        

        <Card className="max-w-sm" imgSrc="/images/blog/image-4.jpg" horizontal >
      <h5 className="text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
      Owner: {proposal.owner}
      </h5>
   
      <p>Location: {proposal.location}</p>
      <p>Price: {proposal.price}</p>
        <p>Contract IPFS: {proposal.contractIPFSHash}</p>
        <p>Images IPFS: {proposal.imagesIPFSHash}</p>
        <p>Land Images: {proposal.landImages}</p>
        <p>Pending Step: Contract Verification {proposal.pendingStep}</p>
        <Button color="blue"onClick={verifyStep}>Verify Step</Button>
    </Card>
        
    </div>
  )
}

export default OracleDetails