import { useState } from "react";
import { ethers } from "ethers";
import AuctionAbi from "../../../app/contracts/AuctionAbi.json";

// Replace with your actual contract addresses & ABIs
const NFT_CONTRACT_ADDRESS = "0xYourNFTContractAddress";
const AUCTION_CONTRACT_ADDRESS = "0xYourAuctionContractAddress";

const NFT_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const AUCTION_ABI = AuctionAbi;

export default function AddNFTToAuction() {
  const [nftAddress, setNftAddress] = useState(""); // NFT contract address
  const [tokenId, setTokenId] = useState(""); // Token ID
  const [startPrice, setStartPrice] = useState(""); // Auction starting price
  const [duration, setDuration] = useState(""); // Auction duration in seconds
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);

  const loadNFT = async () => {
    if (!nftAddress || !tokenId) {
      alert("Please enter NFT Address and Token ID");
      return;
    }

    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("Please install MetaMask");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(nftAddress, NFT_ABI, provider);

      // Fetch NFT metadata URI
      const tokenURI = await contract.tokenURI(tokenId);
      const metadataResponse = await fetch(tokenURI);
      const metadata = await metadataResponse.json();

      setNftData(metadata);
    } catch (error) {
      console.error("Error loading NFT:", error);
      alert("Failed to load NFT.");
    } finally {
      setLoading(false);
    }
  };

  const addToAuction = async () => {
    if (!nftAddress || !tokenId || !startPrice || !duration) {
      alert("Enter all auction details.");
      return;
    }

    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("Please install MetaMask");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Step 1: Approve Auction Contract to transfer NFT
      const nftContract = new ethers.Contract(nftAddress, NFT_ABI, signer);
      const approveTx = await nftContract.approve(AUCTION_CONTRACT_ADDRESS, tokenId);
      await approveTx.wait();

      // Step 2: Call Auction Contract to list NFT
      const auctionContract = new ethers.Contract(AUCTION_CONTRACT_ADDRESS, AUCTION_ABI, signer);
      const auctionTx = await auctionContract.createAuction(
        tokenId,
        ethers.parseEther(startPrice), // Convert ETH value
        duration
      );
      await auctionTx.wait();

      alert("NFT added to auction successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error adding NFT to auction:", error);
      alert("Failed to add NFT to auction.");
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col pt-20 items-center p-6">
      <div className="p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center border border-gray-300">
        <h1 className="text-xl font-semibold mb-4">Add Your NFT to Auction</h1>
        
        {/* NFT Address Input */}
        <input 
          type="text" 
          placeholder="NFT Address" 
          value={nftAddress} 
          onChange={(e) => setNftAddress(e.target.value)} 
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
        />
        
        {/* Token ID Input */}
        <input 
          type="text" 
          placeholder="Token ID" 
          value={tokenId} 
          onChange={(e) => setTokenId(e.target.value)} 
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
        />

        {/* Load NFT Button */}
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
            <p className="text-sm text-gray-600">NFT Metadata:</p>
            <pre className="mt-2 p-2 bg-gray-200 rounded-md text-sm">{JSON.stringify(nftData, null, 2)}</pre>
            {nftData.image && <img src={nftData.image} alt="NFT" className="mt-2 w-full rounded-md" />}
            
            {/* Auction Form */}
            <h2 className="mt-4 text-lg font-semibold">Add to Auction</h2>
            <input 
              type="text" 
              placeholder="Start Price (ETH)" 
              value={startPrice} 
              onChange={(e) => setStartPrice(e.target.value)} 
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <input 
              type="text" 
              placeholder="Duration (seconds)" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <button 
              onClick={addToAuction} 
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Add to Auction"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
