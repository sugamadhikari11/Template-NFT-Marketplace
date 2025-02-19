import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AuctionABI from "../contracts/AuctionAbi.json"; 

const contractAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

const useGetAllAuctionsByStatus = (provider, status) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusMapping = {
    Pending: 0,
    Active: 1,
    Ended: 2,
    Revoked: 3,
  };

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(contractAddress, AuctionABI.abi, provider);
      const statusEnum = statusMapping[status];

      if (statusEnum === undefined) throw new Error("Invalid auction status.");

      const auctionsData = await contract.getAllAuctions(statusEnum);
      console.log("Fetched auctions:", auctionsData);

      const formattedAuctions = await Promise.all(
        auctionsData.map(async (auction) => {
          let startingPrice = ethers.formatEther(auction.initialPrice);

          const metadataUri = auction.metadataUri ? auction.metadataUri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") : null;
          let image = null;

          if (metadataUri) {
            try {
              const response = await fetch(metadataUri);
              const metadata = await response.json();
              image = metadata.image ? metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") : null;
            } catch (err) {
              console.error("Error fetching metadata:", err);
            }
          }

          return {
            id: auction.nftId ? auction.nftId.toString() : "Unknown",
            tokenId: auction.tokenId ? auction.tokenId.toString() : "Unknown",
            nftAddress: auction.nftAddress || "N/A",
            owner: auction.owner || "N/A",
            description: auction.description || "No description",
            image,
            startingPrice,
            status: status,
            highestBid: ethers.formatEther(auction.highestBid),
            auctionEndTime: auction.endTime 
              ? new Date(Number(auction.endTime) * 1000).toLocaleString() 
              : "Unknown",
          };
        })
      );

      setAuctions(formattedAuctions);
    } catch (err) {
      console.error("Error fetching auctions:", err);
      setError(err.message || "Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!provider || !status) return;

    fetchAuctions();
  }, [provider, status]);

  return { auctions, loading, error, fetchAuctions };  // Returning fetchAuctions function
};

export default useGetAllAuctionsByStatus;
