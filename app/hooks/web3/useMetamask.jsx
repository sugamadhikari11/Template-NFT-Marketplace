import { useState, useEffect } from "react";
import { ethers } from "ethers";

const HARDHAT_NETWORK_ID = "31337";

export function useMetamask() {
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setUserAddress(accounts.length ? accounts[0] : null);
    };

    const handleChainChanged = (chainId) => {
      setNetworkError(chainId !== HARDHAT_NETWORK_ID);
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const connect = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) throw new Error("MetaMask not found. Please install it.");

      if (ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
        setNetworkError(true);
        throw new Error("Please switch to the Hardhat network.");
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts.length) throw new Error("No accounts found.");

      setUserAddress(accounts[0]);
      setProvider(new ethers.BrowserProvider(ethereum));
      setNetworkError(false);
      setConnectionStatus("Connected to Hardhat.");
    } catch (error) {
      alert(error.message);
    }
  };

  const disconnect = () => {
    setUserAddress(null);
    setProvider(null);
    setConnectionStatus(null);
    setNetworkError(false);
  };

  return { userAddress, provider, connect, disconnect, connectionStatus, networkError };
}
