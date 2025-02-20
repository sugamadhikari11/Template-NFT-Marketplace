import { useState, useEffect } from "react";
import { ethers } from "ethers";

const SEPOLIA_NETWORK_ID = "11155111";  // Sepolia Testnet Chain ID

export function useMetamask() {
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length) {
        setUserAddress(accounts[0]);
        window.location.reload();
      } else {
        setUserAddress(null);
      }
    };

    const handleChainChanged = async (chainId) => {
      const parsedChainId = parseInt(chainId, 16);
      if (parsedChainId !== Number(SEPOLIA_NETWORK_ID)) {
        setNetworkError(true);
        await switchToSepolia(); // Automatically try to switch network
      } else {
        setNetworkError(false);
        window.location.reload();
      }
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

      const chainId = await ethereum.request({ method: "eth_chainId" });
      const parsedChainId = parseInt(chainId, 16);

      if (parsedChainId !== Number(SEPOLIA_NETWORK_ID)) {
        setNetworkError(true);
        await switchToSepolia(); // Prompt user to switch network
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts.length) throw new Error("No accounts found.");

      const newProvider = new ethers.BrowserProvider(ethereum);
      setProvider(newProvider);

      setUserAddress(accounts[0]);
      setNetworkError(false);
      setConnectionStatus("Connected to Sepolia.");
    } catch (error) {
      alert(error.message);
    }
  };

  const switchToSepolia = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) throw new Error("MetaMask not found. Please install it.");

      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + Number(SEPOLIA_NETWORK_ID).toString(16) }], // Convert to hex
      });

      setNetworkError(false);
      window.location.reload(); // Refresh page after switching network
    } catch (error) {
      if (error.code === 4902) {
        // If Sepolia is not added, prompt user to add it
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + Number(SEPOLIA_NETWORK_ID).toString(16),
              chainName: "Ethereum Sepolia Testnet",
              rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"], // Replace with your Infura ID
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            },
          ],
        });
      } else {
        console.error("Error switching network:", error);
      }
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
