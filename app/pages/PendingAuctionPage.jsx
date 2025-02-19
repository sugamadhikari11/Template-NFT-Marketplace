import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useGetAllAuctionsByStatus from "../hooks/useGetAllAuctionByStatus";

const PendingAuctions = () => {
  const [provider, setProvider] = useState(null);

  // Load provider
  useEffect(() => {
    if (!window.ethereum) return;
    const loadProvider = async () => {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    };
    loadProvider();
  }, []);

  // Fetch pending auctions
  const { auctions, loading, error } = useGetAllAuctionsByStatus(provider, "Pending");

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Pending Auctions</h2>
      {loading && <p>Loading pending auctions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && auctions.length === 0 && <p>No pending auctions available.</p>}

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
            <p className="text-xs text-gray-400">ID: {auction.id}</p>
            <p className="text-sm font-bold">Starting Price: {auction.startingPrice} ETH</p>
            <p className="text-sm text-gray-500">Status: {auction.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingAuctions;
