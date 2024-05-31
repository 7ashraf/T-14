"use client"
import { createContext, useState, useContext } from "react";




const Web3Context = createContext({
    account: null,
    signer: null,
    error: null,
    provider: null,
    landNftContract: null,
    landMarketContract: null,
    subDaoContract: null,
    oracleContract: null,
    helia: null,
    daoContract: null

});


export function Web3Provider({ children }) {
    const [account, setAccount] = useState(null);
    const [signer, setSigner] = useState(null);
    const [error, setError] = useState(null);
    const [provider, setProvider] = useState(null);
    const [landNftContract, setLandNftContract] = useState(null);
    const [landMarketContract, setLandMarketContract] = useState(null);
    const [subDaoContract, setSubDaoContract] = useState(null);
    const [oracleContract, setOracleContract] = useState(null);
    const [daoContract, setDaoContract] = useState(null);
    const [helia, setHelia] = useState(null);
   
   
   
   
    const [state, setState] = useState({
        account: null,
        signer: null,
        error: null,
        provider: null,
        landNftContract: null,
        landMarketContract : null,
        subDaoContract : null,
        oracleContract : null
    });

  return (
    <Web3Context.Provider value={{
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
        setOracleContract,
        helia,
        setHelia,
        daoContract,
        setDaoContract,
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
    return useContext(Web3Context);
}