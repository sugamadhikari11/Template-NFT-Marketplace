import { useState } from "react";
import { ethers } from "ethers";
import AuctionAbi from "../../../app/contracts/AuctionAbi.json"; // Adjust the path as necessary
import useAuctionContract from '../../hooks/useAuctionContract'; // Adjust the path as necessary

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


export default function AddNFTToAuction() {
  const { addNFT } = useAuctionContract();
  const [nftAddress, setNftAddress] = useState(""); // NFT contract address
  const [tokenId, setTokenId] = useState(""); // Token ID
  const [description, setDescription] = useState('');
  const [initialPrice, setInitialPrice] = useState('');  
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [message, setMessage] = useState("");

  const loadNFT = async () => {
    if (!nftAddress || !tokenId) {
      alert("Please enter NFT Address and Token ID");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(nftAddress, NFT_ABI, provider);
      const tokenURI = await contract.tokenURI(tokenId);

      // Replace ipfs:// with Pinata gateway
      const pinataGateway = "https://gateway.pinata.cloud/ipfs/";
      const metadataURI = tokenURI.replace("ipfs://", pinataGateway);
  
      console.log("Fetching metadata from:", metadataURI);
      const metadataResponse = await fetch(metadataURI);
  
      if (!metadataResponse.ok) {
          throw new Error(`HTTP error! status: ${metadataResponse.status}`);
      }
      const metadata = await metadataResponse.json();

      if (metadata.image && metadata.image.startsWith("ipfs://")) {
        metadata.image = metadata.image.replace("ipfs://", pinataGateway);
      }
  
      setNftData(metadata);
    } catch (error) {
      console.error("Error loading NFT:", error);
      alert("Failed to load NFT.");
    } finally {
      setLoading(false);
    }
  };

  const addToAuction = async (e) => {
    e.preventDefault();
    if (!nftAddress || !tokenId || !initialPrice || !description) {
        alert("Enter all auction details.");
        return;
    }

    // Validate NFT address
    if (!ethers.isAddress(nftAddress)) {
        alert("Invalid NFT address.");
        return;
    }

    
    try {

      await addNFT(nftAddress, tokenId, description, ethers.parseEther(initialPrice));

      setMessage('NFT added to auction successfully!');

    } catch (error) {

      console.error('Error adding NFT:', error);

      setMessage('Failed to add NFT to auction.');

    } finally {

      setLoading(false);

    }

  };

  return (
    <main className="w-full min-h-screen flex flex-col pt-20 items-center p-6">
      <div className="p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center border border-gray-300">
        <h1 className="text-xl font-semibold mb-4">Add Your NFT to Auction</h1>
        
        <input 
          type="text" 
          placeholder="NFT Address" 
          value={nftAddress} 
          onChange={(e) => setNftAddress(e.target.value)} 
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
        />
        
        <input 
          type="text" 
          placeholder="Token ID" 
          value={tokenId} 
          onChange={(e) => setTokenId(e.target.value)} 
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
        />
        
        <div className=" w-full flex justify-center">
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
            <h2 className="mt-4 text-lg font-semibold">Add to Auction</h2>
            <input 
              type="text" 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full mb-2 p-2 border border-gray-300 rounded-md"
            />
            <input 
              type="text" 
              placeholder="Start Price (ETH)" 
              value={initialPrice} 
              onChange={(e) => setInitialPrice(e.target.value)} 
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

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </main>
  );
}