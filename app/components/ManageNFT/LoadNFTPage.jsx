import { useState } from "react";
import { ethers } from "ethers";
import useAuctionContract from "../../hooks/useAuctionContract";
import nftABI from "../../contracts/NFTAbi.json";

const AddNFT = () => {
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [description, setDescription] = useState("");
  const [initialPrice, setInitialPrice] = useState("");
  const [status, setStatus] = useState("");
  const [nftData, setNftData] = useState(null);
  const [loadingNFT, setLoadingNFT] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState(false);

  const { approveAndAddNFT, loading, error } = useAuctionContract();

  // ✅ Load NFT Metadata
  const loadNFT = async () => {
    if (!nftAddress || !tokenId) {
      alert("Please enter NFT Address and Token ID");
      return;
    }

    try {
      setLoadingNFT(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(nftAddress, nftABI.abi, provider);
      const tokenURI = await contract.tokenURI(tokenId);

      const pinataGateway = "https://gateway.pinata.cloud/ipfs/";
      const metadataURI = tokenURI.replace("ipfs://", pinataGateway);
      
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
      setLoadingNFT(false);
    }
  };

  // ✅ Approve & List NFT on Auction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !initialPrice) {
      alert("Please enter description and initial price");
      return;
    }

    try {
      setStatus("Approving NFT...");
      setLoadingTransaction(true);

      await approveAndAddNFT(nftAddress, tokenId, description, initialPrice);

      setStatus("NFT added successfully!");
    } catch (error) {
      console.error("Error adding NFT:", error);
      setStatus("Failed to add NFT to auction.");
    } finally {
      setLoadingTransaction(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-lg shadow-md mb-20">
      <h2 className="text-2xl font-bold mb-4">Add NFT to Auction</h2>
      <form onSubmit={handleSubmit}>
        {/* NFT Address Input */}
        <div className="mb-4">
          <label className="block text-gray-700">NFT Address:</label>
          <input
            type="text"
            className="w-full p-2 bg-transparent border border-gray-300 rounded"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
            required
          />
        </div>

        {/* Token ID Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Token ID:</label>
          <input
            type="text"
            className="w-full p-2 border bg-transparent border-gray-300 rounded"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            required
          />
        </div>

        {/* Load NFT Button */}
        <button
          type="button"
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-purple-600"
          disabled={loadingNFT}
          onClick={loadNFT}
        >
          {loadingNFT ? "Loading..." : "Load NFT"}
        </button>

        {/* NFT Display (Only Show After Loading) */}
        {nftData && (
          <div className="mt-5 font-bold">
            <p className="text-md text-gray-600">NFT Image:</p>
            {nftData.image && (
              <img src={nftData.image} alt="NFT" className="w-full h-45 rounded-md" />
            )}
          </div>
        )}

        {/* Show These Fields Only After NFT is Loaded */}
        {nftData && (
          <>
            <div className="mt-4">
              <label className="block text-gray-700">Description:</label>
              <input
                type="text"
                className="w-full p-2 bg-transparent border border-gray-300 rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Initial Price (ETH):</label>
              <input
                type="text"
                className="w-full p-2 bg-transparent border border-gray-300 rounded"
                value={initialPrice}
                onChange={(e) => setInitialPrice(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
              disabled={loadingTransaction}
            >
              {loadingTransaction ? status : "Approve & Add NFT to Auction"}
            </button>
          </>
        )}

        {/* Error Message */}
        {error && <p className="mt-2 text-red-500">Error: {error}</p>}
      </form>
    </div>
  );
};

export default AddNFT;
