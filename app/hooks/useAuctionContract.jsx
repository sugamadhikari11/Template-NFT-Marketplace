import { useState } from "react";
import { ethers } from "ethers";
import auctionABI from "../contracts/AuctionAbi.json";
import nftABI from "../contracts/NFTAbi.json";

// Read auction contract address from environment variables
const auctionAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

const useAuctionContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const approveAndAddNFT = async (nftAddress, tokenId, description, initialPrice) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found.");
      if (!auctionAddress) throw new Error("Auction contract address is missing.");
      if (!nftAddress || !tokenId || !description || !initialPrice) {
        throw new Error("All fields are required.");
      }

      setLoading(true);
      setError(null); // Reset error before transaction

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // ✅ Step 1: Approve Auction Contract
      const nftContract = new ethers.Contract(nftAddress, nftABI.abi, signer);
      const approvalTx = await nftContract.approve(auctionAddress, tokenId);
      await approvalTx.wait();

      // ✅ Step 2: Convert Initial Price to Wei
      const priceInWei = ethers.parseUnits(initialPrice, "ether"); // Use parseUnits for ethers v6

      // ✅ Step 3: Add NFT to Auction
      const auctionContract = new ethers.Contract(auctionAddress, auctionABI.abi, signer);
      const auctionTx = await auctionContract.addNFT(nftAddress, tokenId, description, priceInWei);
      await auctionTx.wait();

      setLoading(false);
      return auctionTx;
    } catch (err) {
      console.error("Error in approveAndAddNFT:", err);
      setError(err.message);
      setLoading(false);
      throw err; // Rethrow error for the calling component
    }
  };

  return { approveAndAddNFT, loading, error };
};

export default useAuctionContract;
