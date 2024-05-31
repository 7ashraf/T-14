'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
const ethers = require("ethers");
import { daoContractAbi, daoContractAddress, landAbi, landAddress, landMarketContractAbi, landMarketContractAddress, oracleContractAbi, oracleContractAddress, subDaoContractAbi, subDaoContractAddress, } from './utils/constants.js';
import IpfsComponent from "@/components/ipfs";
//import { Button } from "@material-tailwind/react";
import { Alert } from "flowbite-react";
import { MyNavBar } from "@/components/NavBar";
import { Card } from "flowbite-react";
import { useWeb3 } from "./context/page";
import Link from "next/link";
import { Main } from "next/document";
import { Button } from "flowbite-react";

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
    setOracleContract, setDaoContract} = useWeb3();

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
    if (landMarketContract) return;
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
      const landOffers = await landMarketContract.getAllLandOffers();
      //const marketListings = await landMarketContract.getMarketListings();
      //console.log(landOffers)
      console.log(landOffers)
      const formattedOffers = landOffers.map((offer) =>{
        return {
          tokenId: offer.tokenId,
          seller: offer.seller,
          price: offer.price,
          //imagesIPFSHash: offer.imagesIPFSHash
        }
      
      });
      console.log("formatted data: ", formattedOffers)
      //console.log(marketListings)
      setMarketListings(formattedOffers);
      setError("")
    } catch (error) {
      console.log(error)
      setError('Error getting market listings');
    }
  
  
  }

  const getSubDaoContract = async () => {
    if(!account) return;
    if(subDaoContract) return;
    try {
      const contract = new ethers.Contract(subDaoContractAddress, subDaoContractAbi, signer);
      setSubDaoContract(contract);

    } catch (error) {
      setError('Error getting contract' + error.message);
    }
  
  
  }

  const getLandNftContract = async() =>{
    if(!account) return;
    if(landNftContract) return;
    try {
      const contract = new ethers.Contract(landAddress, landAbi, signer);
      setLandNftContract(contract);
    } catch (error) {
      setError('Error getting contract' + error.message);
    }
  
  }

  const getOracleContract = async () => {
    if (!account) return;
    try {
        const contract = new ethers.Contract(
            oracleContractAddress,
            oracleContractAbi,
            signer
        );
        setOracleContract(contract);
    } catch (error) {
        setError("Error getting contract" + error.message);
    }
  }

  const getDaoContract = async () => {
    if (!account) return;
    try {
        const contract = new ethers.Contract(
            daoContractAddress,
            daoContractAbi,
            signer
        );
        setDaoContract(contract);
    } catch (error) {
        setError("Error getting contract" + error.message);
    }
  }


  useEffect(() => {
    const initWeb3 = async () => {
      await connectWallet();
      await getContract();
      await getSubDaoContract();
      await getLandNftContract();
      await getDaoContract();
      await getOracleContract();

    }
     //connectWallet()
    //  getContract()
    //  getSubDaoContract()
    initWeb3()
    getMarketListings()
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

  
 
  }, [account, marketListings])

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
        
        <IpfsComponent></IpfsComponent>
        <div>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <Button color="blue" onClick={() => setAccount(null)}> Disconnect Wallet </Button>
        </div>
      ) : (
        <button onClick={connectWallet} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Connect Wallet</button>

      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <br></br>

      {marketListings.length == 0 && <p>No Market Listings</p>}

      {marketListings.length > 0 && marketListings.map((listing, index) => (

        <div>
            <h2 key={index}></h2>
            <Card href="#" className="max-w-sm">
            <h5 className="text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
              Land Seller: {listing.seller}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Land Price{listing.price.toString()}
            </p>

            <p className="font-normal text-gray-700 dark:text-gray-400">
            Land NFT ID: {listing.tokenId.toString()}
            </p>

           
            <Button color="dark" pill onClick={() => {}}>Buy Land</Button>
      </Card>
      <br></br>
        </div>
        
      ))}




    </div>

      </div>
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
    </main>
  );
}
