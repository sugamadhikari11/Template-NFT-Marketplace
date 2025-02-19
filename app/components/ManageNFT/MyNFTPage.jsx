import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useGetAllNFTsByUser from "../../hooks/useGetAllNFTsByUSER";
import useStartEndAuction from "../../hooks/useStartEndAuction"; // Import the custom hook

const MyNFTs = () => {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const [categorizedNFTs, setCategorizedNFTs] = useState({
    Pending: [],
    Active: [],
    Ended: [],
    Revoked: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Load provider and address
  useEffect(() => {
    if (!window.ethereum) return;

    const loadProvider = async () => {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(web3Provider);
      setUserAddress(address);
    };

    loadProvider();
  }, []);

  // Fetch NFTs by user
  const { nfts, loading, error } = useGetAllNFTsByUser(provider, userAddress);

  useEffect(() => {
    if (nfts) {
      const categorized = {
        Pending: [],
        Active: [],
        Ended: [],
        Revoked: [],
      };

      nfts.forEach((nft) => {
        if (nft.status === "Pending") categorized.Pending.push(nft);
        else if (nft.status === "Active") categorized.Active.push(nft);
        else if (nft.status === "Ended") categorized.Ended.push(nft);
        else if (nft.status === "Revoked") categorized.Revoked.push(nft);
      });

      setCategorizedNFTs(categorized);
    }
  }, [nfts]);

  // Get start/end auction functions from the custom hook
  const { startAuction, endAuction, loading: auctionLoading, error: auctionError } = useStartEndAuction(provider, userAddress);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleStartAuction = (nft) => {
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setStartingPrice("");
    setDuration("");
  };

  const handleSubmitAuction = async () => {
    if (startingPrice <= 0 || duration <= 0) {
      alert("Starting price and duration must be greater than 0.");
      return;
    }
  
    console.log("Submitting auction with the following details:");
    console.log("Token ID:", selectedNFT.tokenId);
    console.log("Starting Price:", startingPrice);
    console.log("Duration:", duration);
  
    try {
      await startAuction(selectedNFT.tokenId, ethers.parseEther(startingPrice), duration);
      console.log("Auction started successfully");
      handleModalClose(); // Close the modal after starting auction
    } catch (err) {
      console.error("Error starting auction:", err);
      alert("Failed to start auction. Check the console for errors.");
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Auction NFTs</h2>

      {loading && <p>Loading NFTs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded-lg"
        >
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Ended">Ended</option>
          <option value="Revoked">Revoked</option>
        </select>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">
          {selectedCategory} ({categorizedNFTs[selectedCategory].length})
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {categorizedNFTs[selectedCategory].map((nft) => {
            return (
              <div key={nft.tokenId} className="border p-4 rounded-lg">
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.description}
                    className="w-full h-40 object-cover rounded-md"
                  />
                ) : (
                  <p>No image available</p>
                )}
                <h3 className="text-lg font-semibold mt-2">{nft.description}</h3>
                <p className="text-xs text-gray-400">Token ID: {nft.tokenId}</p>
                <p className="text-sm font-bold">Price: {nft.initialPrice} ETH</p>
                <p className="text-sm text-gray-500">Status: {nft.status}</p>

                {/* Show Start or End Auction Button */}
                {nft.status === "Pending" && (
                  <button
                    onClick={() => handleStartAuction(nft)}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                    disabled={auctionLoading}
                  >
                    {auctionLoading ? "Starting..." : "Start Auction"}
                  </button>
                )}

                {nft.status === "Active" && (
                  <button
                    onClick={() => endAuction(nft.tokenId)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
                    disabled={auctionLoading}
                  >
                    {auctionLoading ? "Ending..." : "End Auction"}
                  </button>
                )}

                {auctionError && (
                  <p className="text-red-500 mt-2">{auctionError}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Start Auction */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Start Auction for NFT #{selectedNFT.tokenId}</h2>
            <input
              type="number"
              placeholder="Starting Price (ETH)"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSubmitAuction}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                disabled={auctionLoading}
              >
                {auctionLoading ? "Starting..." : "Start Auction"}
              </button>
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
            {auctionError && (
              <p className="text-red-500 mt-2">{auctionError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
