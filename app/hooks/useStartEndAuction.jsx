import { useState } from "react";
import { ethers } from "ethers"; // Ensure you're importing ethers correctly
import auctionABI from "../contracts/AuctionAbi.json"; // Ensure the path to your Auction ABI is correct

const useStartEndAuction = (provider, userAddress) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start Auction function
  const startAuction = async (nftTokenId, startingPrice, duration) => {
    if (!provider || !userAddress) return;

    try {
      setLoading(true);
      setError(null); // Reset the error before starting the transaction

      // Ensure the provider is a Web3Provider and get the signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create the contract instance with signer
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_AUCTION_ADDRESS,
        auctionABI.abi,
        signer // Use the signer to send transactions
      );

      console.log("Starting the auction on contract with NFT token ID:", nftTokenId);

      // Send the startAuction transaction to the contract
      const tx = await contract.startAuction(nftTokenId, startingPrice, duration);

      console.log("Transaction sent: ", tx);
      await tx.wait(); // Wait for the transaction to be mined
      alert(`Auction for NFT ${nftTokenId} started successfully`);
    } catch (err) {
      console.error("Error starting auction:", err);
      setError("Failed to start auction");
    } finally {
      setLoading(false);
    }
  };
  const revokeAuction = async (id) => {
    if (!provider || !userAddress) {
      console.error("Provider or user address is missing.");
      return;
    }
    
  
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_AUCTION_ADDRESS, auctionABI.abi, signer);
  
      const tx = await contract.revokeAuction(id);
      await tx.wait();
  
      console.log("Auction revoked successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Error revoking auction:", err);
      setError("Failed to revoke auction.");
      setLoading(false);
    }
  };
  

  // End Auction function
  const endAuction = async (nftTokenId) => {
    if (!provider || !userAddress) return;

    try {
      setLoading(true);
      setError(null); // Reset the error before starting the transaction

      // Ensure the provider is a Web3Provider and get the signer
      const web3Provider = new ethers.BrowserProvider(ethereum)
      const signer = web3Provider.getSigner();

      // Create the contract instance with signer
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_AUCTION_ADDRESS,
        auctionABI.abi,
        signer // Use the signer to send transactions
      );

      // Send the endAuction transaction to the contract
      const tx = await contract.endAuction(nftTokenId);
      await tx.wait();
      alert(`Auction for NFT ${nftTokenId} ended successfully`);
    } catch (err) {
      console.error("Error ending auction:", err);
      setError("Failed to end auction");
    } finally {
      setLoading(false);
    }
  };

  return { startAuction, revokeAuction, endAuction, loading, error };
};

export default useStartEndAuction;
