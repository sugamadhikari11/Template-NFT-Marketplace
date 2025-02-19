import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import AuctionABI from "../contracts/AuctionAbi.json";

const contractAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

const useGetAllNFTsByUser = (provider, userAddress) => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch NFTs
  const fetchNFTs = useCallback(async () => {
    if (!provider || !userAddress) return;

    setLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, AuctionABI.abi, signer);

      // 🔥 Correct function call (view function doesn't need signer)
      const userNFTs = await contract.getAllNFTsByUser();

      // 🔄 Convert BigNumbers and format data
      const formattedNFTs = await Promise.all(userNFTs.map(async (nft) => {
        const metadataUri = nft.metadataUri ? nft.metadataUri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") : null;
        let image = null;

        // Fetch metadata if URI exists
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
          id: nft.nftId.toString(),
          tokenId: nft.tokenId.toString(),
          nftAddress: nft.nftAddress,
          owner: nft.owner,
          description: nft.description,
          image,
          initialPrice: ethers.formatEther(nft.initialPrice),
          status: mapStatus(parseInt(nft.status)),  
        };
      }));

      setNFTs(formattedNFTs);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError(err.message || "Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  }, [provider, userAddress]); // Dependencies

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          console.log("Account changed:", accounts[0]);
          fetchNFTs(); // 🔄 Reload NFTs when account changes
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [fetchNFTs]);

  // Run the fetch function when provider and userAddress change
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  // Helper function to map status
  const mapStatus = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Active";
      case 2:
        return "Ended";
      case 3:
        return "Revoked";
      default:
        return "Unknown";
    }
  };

  return { nfts, loading, error, refetchNFTs: fetchNFTs }; // Return fetchNFTs as refetchNFTs
};

export default useGetAllNFTsByUser;
