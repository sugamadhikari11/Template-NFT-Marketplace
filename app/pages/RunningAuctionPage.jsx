"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import useGetAllAuctionsByStatus from "../hooks/useGetAllAuctionByStatus";

const RunningAuctions = () => {
  const [provider, setProvider] = useState(null);
  const router = useRouter();

  // Load provider
  useEffect(() => {
    if (!window.ethereum) return;
    const loadProvider = async () => {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    };
    loadProvider();
  }, []);

  // Fetch active auctions
  const { auctions, loading, error } = useGetAllAuctionsByStatus(provider, "Active");

  // Navigate to the bid page
  const handleBid = (id) => {
    router.push(`/bid/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Running Auctions</h2>
      {loading && <p>Loading active auctions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && auctions.length === 0 && <p>No active auctions available.</p>}
      
      <div className="grid grid-cols-2 gap-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="border p-4 rounded-lg">
            {auction.image ? (
              <img
                src={auction.image}
                alt={auction.description}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <p>No image available</p>
            )}
            <h3 className="text-lg font-semibold mt-2">{auction.description}</h3>
            <p className="text-xs text-gray-400">Token ID: {auction.tokenId}</p>
            <p className="text-xs text-gray-400">Token ID: {auction.id}</p>
            <p className="text-sm font-bold">Starting Price: {auction.startingPrice} ETH</p>
            <p className="text-sm text-gray-500">Status: {auction.status}</p>

            {/* Place Bid Button */}
            <button
              onClick={() => handleBid(auction.id)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Place Bid
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RunningAuctions;
