'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
const ethers = require("ethers");
import { landAbi, landAddress } from './utils/constants.js';





export default function Home() {

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [landContract, setLandContract] = useState(null);
  const[signer, setSigner] = useState(null);
  const [userLands, setUserLands] = useState([]);


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

  useEffect(() => {
     //connectWallet()
     getContract()
  
 
  }, [account])
  
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Hello World</h1>
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
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
        
      </div>
    </main>
  );
}
