"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
// import auctionContractABI from "../contracts/AuctionContract.json";

export default function RunningAuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auctionContractAddress = "YOUR_AUCTION_CONTRACT_ADDRESS";

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(auctionContractAddress, auctionContractABI, provider);
      const auctionList = await contract.getAllAuctions();

      const formattedAuctions = auctionList.map((auction) => ({
        id: Number(auction.id),
        tokenId: Number(auction.tokenId),
        currentBid: ethers.formatEther(auction.highestBid),
        endTime: Number(auction.endTime),
        imageUrl: `https://ipfs.io/ipfs/${auction.metadataUri}`, // Adjust based on your NFT metadata storage
      }));

      setAuctions(formattedAuctions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setLoading(false);
    }
  };

  const placeBid = async (auctionId, bidAmount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(auctionContractAddress, auctionContractABI, signer);

      const bidValue = ethers.parseEther(bidAmount);
      const tx = await contract.placeBid(auctionId, { value: bidValue });
      await tx.wait();

      alert("Bid placed successfully!");
      fetchAuctions(); // Refresh auctions after bidding
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Running Auctions</h2>
      {loading ? (
        <p>Loading auctions...</p>
      ) : auctions.length === 0 ? (
        <p className="text-gray-500">No auctions available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <div key={auction.id} className="p-4 bg-gray-800 text-white rounded shadow">
              <h3 className="text-lg font-semibold">NFT #{auction.tokenId}</h3>
              <img src={auction.imageUrl} alt={`NFT ${auction.tokenId}`} className="w-full h-40 object-cover rounded" />
              <p>Current Bid: {auction.currentBid} ETH</p>
              <p>Time Left: {Math.max(0, Math.floor((auction.endTime - Date.now() / 1000) / 60))} min</p>
              <input
                type="number"
                placeholder="Enter bid (ETH)"
                className="w-full mt-2 p-2 border border-gray-300 text-black"
                onChange={(e) => auction.userBid = e.target.value}
              />
              <button
                onClick={() => placeBid(auction.id, auction.userBid)}
                className="mt-2 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Place Bid
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
