"use client"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AuctionABI from "../../contracts/AuctionAbi.json"; 

const contractAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

const BidPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAuction = async () => {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, AuctionABI.abi, provider);
        
        const auctionData = await contract.getAuctionByTokenId(tokenId);
        setAuction({
          tokenId: auctionData.tokenId.toString(),
          owner: auctionData.owner,
          description: auctionData.description,
          image: auctionData.image ? auctionData.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") : null,
          highestBid: ethers.formatEther(auctionData.highestBid),
        });
      } catch (err) {
        console.error("Error fetching auction:", err);
        setError("Failed to fetch auction details.");
      }
      setLoading(false);
    };

    fetchAuction();
  }, [tokenId]);

  const handleBid = async () => {
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      alert("Enter a valid bid amount.");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AuctionABI.abi, signer);

      const tx = await contract.placeBid(tokenId, {
        value: ethers.parseEther(bidAmount),
      });
      await tx.wait();

      alert("Bid placed successfully!");
      router.push("/");
    } catch (err) {
      console.error("Bid failed:", err);
      setError("Bid transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading auction details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!auction) return <p>No auction found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Bid on NFT</h2>
      {auction.image && (
        <img src={auction.image} alt={auction.description} className="w-full h-64 object-cover rounded-md" />
      )}
      <h3 className="text-lg font-semibold mt-2">{auction.description}</h3>
      <p className="text-sm text-gray-500">Token ID: {auction.tokenId}</p>
      <p className="text-sm font-bold">Highest Bid: {auction.highestBid} ETH</p>

      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter bid amount"
        className="mt-4 w-full p-2 border rounded-lg"
      />

      <button
        onClick={handleBid}
        className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        disabled={loading}
      >
        {loading ? "Placing Bid..." : "Place Bid"}
      </button>
    </div>
  );
};

export default BidPage;
