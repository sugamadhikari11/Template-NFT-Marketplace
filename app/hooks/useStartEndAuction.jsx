import { useState } from "react";
import { ethers } from "ethers";
import AuctionABI from "../contracts/AuctionAbi.json"; // Adjust path to your contract ABI

const useStartEndAuction = (provider, userAddress) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start Auction function
  const startAuction = async (nftTokenId, startingPrice, duration) => {
    if (!provider || !userAddress) return;

    // Get signer from provider (to send transactions)
    const signer = provider.getSigner();

    // Create contract instance with signer
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AUCTION_ADDRESS,
      AuctionABI.abi,
      provider
    );

    setLoading(true);
    setError(null);

    try {
      console.log("Starting the auction on contract with NFT token ID:", nftTokenId);
      // Call the startAuction function from the contract
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

  // End Auction function
  const endAuction = async (nftTokenId) => {
    if (!provider || !userAddress) return;

    // Get signer from provider (to send transactions)
    const signer = provider.getSigner();

    // Create contract instance with signer
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_AUCTION_ADDRESS,
      AuctionABI.abi,
      signer // Signer to send transactions
    );

    setLoading(true);
    setError(null);

    try {
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

  return { startAuction, endAuction, loading, error };
};

export default useStartEndAuction;
