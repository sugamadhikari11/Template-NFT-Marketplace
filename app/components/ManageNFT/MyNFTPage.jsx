import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useGetAllNFTsByUser from "../../hooks/useGetAllNFTsByUSER";
import useStartEndAuction from "../../hooks/useStartEndAuction";

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
  const [loadingNFT, setLoadingNFT] = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;

    const loadProvider = async () => {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      setProvider(web3Provider);
      setUserAddress(await signer.getAddress());
    };
    loadProvider();
  }, []);

  const { nfts, loading, error, refetchNFTs } = useGetAllNFTsByUser(provider, userAddress);
  const { startAuction, revokeAuction, endAuction, loading: auctionLoading, error: auctionError } = useStartEndAuction(provider, userAddress);

  useEffect(() => {
    if (nfts) {
      const categorized = { Pending: [], Active: [], Ended: [], Revoked: [] };
      nfts.forEach((nft) => categorized[nft.status]?.push(nft));
      setCategorizedNFTs(categorized);
    }
  }, [nfts]);

  const handleStartAuction = (nft) => {
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const handleSubmitAuction = async () => {
    if (!startingPrice || !duration) return alert("Provide valid price and duration.");
    const auctionDuration = Math.floor((new Date(duration).getTime() - Date.now()) / 1000);
    if (auctionDuration <= 0) return alert("Auction must be set for the future.");
    try {
      setLoadingNFT(selectedNFT.id);
      await startAuction(selectedNFT.id, ethers.parseUnits(startingPrice), auctionDuration);
      handleModalClose();
      refetchNFTs();
    } catch (err) {
      alert("Failed to start auction.");
    } finally {
      setLoadingNFT(null);
    }
  };

  const handleRevokeAuction = async (id) => {
    try {
      setLoadingNFT(id);
      await revokeAuction(id);
      refetchNFTs();
    } catch {
      alert("Failed to revoke auction.");
    } finally {
      setLoadingNFT(null);
    }
  };

  const handleEndAuction = async (id, endTime) => {
    const currentTime = Math.floor(Date.now() / 1000);
  if (endTime > currentTime) {
    return alert("Auction cannot be ended before its designated time.");
  }
    try {
      setLoadingNFT(id);
      await endAuction(id);
      refetchNFTs();
    } catch {
      alert("Failed to end auction.");
    } finally {
      setLoadingNFT(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Auction NFTs</h2>
      {loading && <p>Loading NFTs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border p-2 bg-transparent rounded-lg">
        {Object.keys(categorizedNFTs).map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
        {categorizedNFTs[selectedCategory].map((nft) => (
          <div key={nft.tokenId} className="border p-4 rounded-lg">
            <img src={nft.image || "default.jpg"} alt={nft.description} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-semibold mt-2">{nft.description}</h3>
            <p className="text-sm">Original Price: {nft.initialPrice} ETH</p>
            <p className="text-sm">Highest BidPrice: {nft.highestBid} ETH</p>
            {nft.status === "Pending" && (
              <div className="flex gap-2">
                <button onClick={() => handleStartAuction(nft)} className="px-4 py-2 bg-green-500 text-white rounded-lg" disabled={loadingNFT === nft.id}>
                  {loadingNFT === nft.id ? "Starting..." : "Start Auction"}
                </button>
                <button onClick={() => handleRevokeAuction(nft.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg" disabled={loadingNFT === nft.id}>
                  {loadingNFT === nft.id ? "Revoking..." : "Revoke"}
                </button>
              </div>
            )}
            {nft.status === "Active" && (
              <button onClick={() => handleEndAuction(nft.id, nft.endTime)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" disabled={loadingNFT === nft.id}>
                {loadingNFT === nft.id ? "Ending..." : "End Auction"}
              </button>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Start Auction for NFT #{selectedNFT.tokenId}</h2>
            <input type="number" placeholder="Starting Price (ETH)" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} className="border p-2 w-full mb-4 rounded-lg" />
            <input type="date" value={duration} onChange={(e) => setDuration(e.target.value)} className="border p-2 w-full mb-4 rounded-lg" />
            <div className="flex justify-between">
              <button onClick={handleSubmitAuction} className="px-4 py-2 bg-green-500 text-white rounded-lg" disabled={loadingNFT === selectedNFT.id}>
                {loadingNFT === selectedNFT.id ? "Starting..." : "Start Auction"}
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
