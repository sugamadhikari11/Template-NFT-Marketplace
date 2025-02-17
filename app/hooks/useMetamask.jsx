import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Network IDs for different networks (Sepolia and Hardhat)
const SEPOLIA_NETWORK_ID = "0xaa36a7"; // Sepolia network ID (EIP-155)
const HARDHAT_NETWORK_ID = "31337"; // Hardhat network ID

export function useMetamask() {
  const [accounts, setAccounts] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  // Check if MetaMask is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          // Listen for network and account changes
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccounts(accounts);
            setUserAddress(accounts[0]);

            const newProvider = new ethers.providers.Web3Provider(ethereum);
            setProvider(newProvider);

            const currentChainId = await ethereum.request({ method: "eth_chainId" });
            setCurrentNetwork(currentChainId);

            // Check if the connected network is correct (Sepolia or Hardhat)
            if (![SEPOLIA_NETWORK_ID, HARDHAT_NETWORK_ID].includes(currentChainId)) {
              setNetworkError(true); // Network mismatch
              alert("Please switch to the correct network (Sepolia or Hardhat).");
            } else {
              setNetworkError(false); // Network is valid
              setConnectionStatus("Successfully connected to MetaMask!"); // Success message
            }
          }
        } else {
          alert("Please install MetaMask.");
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("An error occurred while connecting to MetaMask.");
      }
    };

    checkConnection();

    // Cleanup listeners when component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => window.location.reload());
        window.ethereum.removeListener("accountsChanged", () => window.location.reload());
      }
    };
  }, []);

  // Connect to MetaMask
  const connect = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setAccounts(accounts);
          setUserAddress(accounts[0]);

          const newProvider = new ethers.providers.Web3Provider(ethereum);
          setProvider(newProvider);

          const currentChainId = await ethereum.request({ method: "eth_chainId" });
          setCurrentNetwork(currentChainId);

          if (![SEPOLIA_NETWORK_ID, HARDHAT_NETWORK_ID].includes(currentChainId)) {
            setNetworkError(true);
            alert("Please switch to the correct network (Sepolia or Hardhat).");
          } else {
            setNetworkError(false);
            setConnectionStatus("Successfully connected to MetaMask!"); // Success message
          }
        }
      } else {
        alert("MetaMask not found. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("An error occurred while connecting to MetaMask.");
    }
  };

  // Disconnect from MetaMask
  const disconnect = () => {
    setAccounts([]);
    setUserAddress(null);
    setProvider(null);
    setConnectionStatus(null); // Clear connection status
    setNetworkError(false); // Reset network error state
    setCurrentNetwork(null); // Reset current network state
    // Optionally clear persisted data from localStorage or cookies
    localStorage.removeItem("connectedWallet");
  };

  return { accounts, userAddress, provider, connect, disconnect, connectionStatus, networkError, currentNetwork };
}
