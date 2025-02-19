import React, { useState } from "react";
import { useMetamask } from "../../hooks/web3/useMetamask"; // Import MetaMask hook
import usePlaceBid from "../../hooks/usePlaceBid";
import { Auction_ADDRESS } from "../../../utils/config";
import { ethers } from "ethers";

const BidModal = ({ auction, isOpen, onClose }) => {
  const [bidAmount, setBidAmount] = useState("");
  const { provider, connect, userAddress } = useMetamask();
  const { placeBid, loading, error } = usePlaceBid(Auction_ADDRESS);

  if (!isOpen || !auction) return null;

  const handleBid = async () => {
    try {
      if (!provider) {
        await connect(); // Attempt to connect if not connected
        return; // Exit early to prevent errors
      }
      const signer = await provider.getSigner();
      if (!userAddress) {
        await connect();
      }

      if (!signer) {
        alert("No signer found. Connect your wallet.");
        return;
      }

      // Convert bidAmount to Wei
      const bidAmountInWei = ethers.parseEther(bidAmount.toString());

      console.log("Placing bid with:", {
        id: auction.id,
        bidAmount: bidAmountInWei.toString(),
        sender: userAddress,
        auctionStatus: auction.status,
        auctionEndTime: auction.auctionEndTime,
        currentHighestBid: auction.highestBid,
      });

      // Auction status checks
      if (auction.status !== "Active") {
        alert("Auction is not active.");
        return;
      }

      if (Date.now() / 1000 > auction.endTime) {
        alert("Auction has ended.");
        return;
      }

      const tx = await placeBid(auction.id, bidAmountInWei, signer);

      if (!tx) {
        alert("Transaction failed to initiate.");
        return;
      }

      alert("Bid placed successfully!");
      onClose();
    } catch (error) {
      console.error("Bid error:", error);
      alert(error.reason || error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-3/4 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Bid on {auction.description}</h2>
        <p className="text-sm text-gray-500">Token ID: {auction.tokenId}</p>
        <p className="text-sm font-bold">Starting Price: {auction.startingPrice} ETH</p>
        <p className="text-sm font-bold">Endtime: {auction.auctionEndTime}</p>

        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter bid amount (ETH)"
          className="w-full p-2 border rounded-md mt-4"
          disabled={loading}
        />

        <button
          onClick={handleBid}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full"
        >
          {loading ? "Placing Bid..." : userAddress ? "Submit Bid" : "Connect Wallet"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default BidModal;
