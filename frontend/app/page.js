'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
const ethers = require("ethers");
import { landAbi, landAddress, landMarketContractAbi, landMarketContractAddress, subDaoContractAbi, subDaoContractAddress } from './utils/constants.js';
import IpfsComponent from "@/components/ipfs";
import { Button } from "@material-tailwind/react";
import { Alert } from "flowbite-react";
import { MyNavBar } from "@/components/NavBar";
import { Card } from "flowbite-react";
import { useWeb3 } from "./context/page";
import Link from "next/link";

export default function Home() {

  //const [provider, setProvider] = useState(null);
  //const [account, setAccount] = useState(null);
  //const [error, setError] = useState(null);
  const [landContract, setLandContract] = useState(null);
 // const[signer, setSigner] = useState(null);
  const [userLands, setUserLands] = useState([]);
  const [marketListings, setMarketListings] = useState([]);
  //const [landMarketContract, setLandMarketContract] = useState(null);
  //const [subDaoContract, setSubDaoContract] = useState(null);

  const {
    account,
    setAccount,
    signer,
    setSigner,
    error,
    setError,
    provider,
    setProvider,
    landNftContract,
    setLandNftContract,
    landMarketContract,
    setLandMarketContract,
    subDaoContract,
    setSubDaoContract,
    oracleContract,
    setOracleContract} = useWeb3();

    console.log(useWeb3())

  const connectWallet = async () => {
    console.log(account)
    if (account) {console.log("account exists"); return;}
    try {
      if(window.ethereum) {
        // Request account access
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        setProvider(provider);

        const signer = await provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        console.log(address)
        setAccount(address);
        console.log(address);
        setError(null);
      }else{
        setError('Install Metamask');
      }
    } catch (error) {
      setError('Error connecting to wallet: ' + error.message);
    }
  }

  const getContract = async () => {
    if(!account) return;
    console.log("trying to get contract")
    try {
      const contract = new ethers.Contract(landAddress, landAbi, signer);
      const landMarketContract = new ethers.Contract(landMarketContractAddress, landMarketContractAbi, signer);
      setLandMarketContract(landMarketContract);
      console.log(contract)
      setLandContract(contract);
    } catch (error) {
      setError('Error getting contract' + error.message);
    }
  
  }

  const getUserLands = async () => {
    if(!landContract) return;
    try {
      const userLands = await landContract.getUserLands(account);
      console.log(userLands)
      setUserLands(userLands);
    } catch (error) {
      setError('Error getting user lands');
    }
  
  }

  const mintLand = async () => {
    if(!landContract){setError("no contract"); return;} 
    try {
      const tx = await landContract.mintLand(account);

      await tx.wait();
      console.log(tx)
      //getUserLands();
    } catch (error) {
      console.log(error)
      setError(`Error minting land: ${error.message}`);
    }
  
  }

  const getMarketListings = async () => {
    console.log("getting market listings")
    if(!landMarketContract) return;
    try {
      //logic should be changed
      for (let i = 0; i < 10; i++) {
        const marketListing = await landMarketContract.landOffers(i);
        if(marketListing.seller === ethers.constants.AddressZero) break;
        console.log(marketListing)
        setMarketListings([...marketListings, marketListing]);
      }
      const marketListings = await landMarketContract.getMarketListings();
      console.log(marketListings)
      setMarketListings(marketListings);
    } catch (error) {
      setError('Error getting market listings');
    }
  
  
  }

  const getSubDaoContract = async () => {
    if(!account) return;
    try {
      const contract = new ethers.Contract(subDaoContractAddress, subDaoContractAbi, signer);
      setSubDaoContract(contract);
    } catch (error) {
      setError('Error getting contract' + error.message);
    }
  
  
  }


  useEffect(() => {
    const initWeb3 = async () => {
      await connectWallet();
      await getContract();
      await getSubDaoContract();

    }
     //connectWallet()
    //  getContract()
    //  getSubDaoContract()
    initWeb3()
     getMarketListings()
     require("bootstrap/dist/js/bootstrap.bundle.min.js");

  
 
  }, [account])

  const testTransaction = async () => {
    try {
        console.log("dao is creating proposal")
        console.log(subDaoContract)
        const hexData = "0x123456";

  // Convert hexadecimal data to bytes

        const tx = await subDaoContract.createLandListingProposal("location", 100,"hash" ,"hash" );
        console.log(tx)
        await tx.wait();
        console.log("Proposal created");
        return tx;
    } catch (error) {
        setError("Error creating proposal" + error.message);
        return error;
    }
}
  
  return (
    
    <main className={styles.main}>
      <MyNavBar></MyNavBar>
      <div className={styles.description}>
        
        <h1>Hello World</h1>
        <IpfsComponent></IpfsComponent>
        <div>
      <h1>Ethereum Wallet Login</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={() => setAccount(null)}>Disconnect Wallet</button>
          <button onClick={getUserLands}>Get User Lands</button>
          <button onClick={mintLand}>Mint Land</button>


        </div>
      ) : (
        <button onClick={connectWallet} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Connect Wallet</button>

      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <br></br>

      {marketListings.length == 0 && <p>No Market Listings</p>}

      {marketListings.length > 0 && marketListings.map((listing, index) => (

        <div>
            <h2 key={index}>Market Listing: {listing}</h2>
            <Card href="#" className="max-w-sm">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Noteworthy technology acquisitions 2021
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>
      </Card>
        </div>
        
      ))}




    </div>

      </div>
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
      <Button color="black" onClick={testTransaction}>Create Proposal</Button>
      <Link href="/MyProposals">My Proposals</Link>

    </main>
  );
}
