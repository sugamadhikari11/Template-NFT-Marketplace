"use client";

import { useState } from "react";

export default function LoadNFT() {
  const [tokenId, setTokenId] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);

  const loadNFT = async () => {
    if (!tokenId || !userAddress) {
      alert("Please enter both Token ID and User Address");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/nft?tokenId=${tokenId}&userAddress=${userAddress}`);
      const data = await response.json();
      setNftData(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      alert("Error loading NFT");
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col pt-20 items-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center border border-gray-300">
        <h1 className="text-xl font-semibold mb-4">Load Your NFT</h1>
        <input 
          type="text" 
          placeholder="Token ID" 
          value={tokenId} 
          onChange={(e) => setTokenId(e.target.value)} 
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
        />
        <input 
          type="text" 
          placeholder="User Address" 
          value={userAddress} 
          onChange={(e) => setUserAddress(e.target.value)} 
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <div className="w-full flex justify-center">
          <button 
            type="button" 
            disabled={loading} 
            onClick={loadNFT} 
            className={`w-3/4 py-2 rounded-md text-white font-semibold transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {loading ? "Loading..." : "Load NFT"}
          </button>
        </div>
        {nftData && (
          <div className="mt-4 w-full text-center">
            <p className="text-sm text-gray-600">NFT Data:</p>
            <pre className="mt-2 p-2 bg-gray-200 rounded-md text-sm">{JSON.stringify(nftData, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
