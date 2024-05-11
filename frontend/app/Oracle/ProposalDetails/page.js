"use client"
import React, { useEffect, useState } from 'react'

function OracleDetails({searchParams}) {
    const [proposal, setProposal] = useState(null);
    const [error, setError] = useState(null);

    console.log(searchParams.id)

    useEffect(() => {
        
        // fetch proposal details
        setProposal(searchParams.id)

    }, [])

    const verifyStep = async () => {
        // verify step
        try{
            const oracleStatus = await oracleContract.getProposalStatus(proposal.id);
            await oracleContract.verifyStep(proposal.id, oracleStatus);
            setError(null);
        }catch(error){
            setError('Error verifying step: ' + error.message);
        }
    }

    if(!proposal){
        return <div>Loading...</div>
    }

  return (
    <div>
        <h1>Proposal Details</h1>

        {/* {owmner, location, Price, contract ipfs images, land images, pending step, cta verify} */}
        <p>Owner: {proposal.owner}</p>
        <p>Location: {proposal.location}</p>
        <p>Price: {proposal.price}</p>
        <p>Contract IPFS: {proposal.contractIPFSHash}</p>
        <p>Images IPFS: {proposal.imagesIPFSHash}</p>
        <p>Land Images: {proposal.landImages}</p>
        <p>Pending Step: {proposal.pendingStep}</p>
        <button onClick={verifyStep}>Verify Step</button>
    </div>
  )
}

export default OracleDetails