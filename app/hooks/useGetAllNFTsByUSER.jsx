import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import AuctionABI from "../contracts/AuctionAbi.json";

const contractAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

const useGetAllNFTsByUser = (provider) => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState(null); // Track active account

  // Fetch NFTs owned by the user
  const fetchNFTs = useCallback(async () => {
    if (!provider || !userAddress) return;

    setLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(contractAddress, AuctionABI.abi, provider);
      const userNFTs = await contract.getAllNFTsByUser();

      const formattedNFTs = await Promise.all(
        userNFTs.map(async (nft) => {
          const metadataUri = nft.metadataUri
            ? nft.metadataUri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
            : null;
          let image = null;

          if (metadataUri) {
            try {
              const response = await fetch(metadataUri);
              const metadata = await response.json();
              image = metadata.image
                ? metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
                : null;
            } catch (err) {
              console.error("Error fetching metadata:", err);
            }
          }

          return {
            id: nft.nftId.toString(),
            tokenId: nft.tokenId.toString(),
            nftAddress: nft.nftAddress,
            owner: nft.owner.toLowerCase(),
            description: nft.description,
            image,
            initialPrice: ethers.formatEther(nft.initialPrice),
            status: mapStatus(parseInt(nft.status)),
          };
        })
      );

      // 🔥 Filter NFTs to show only those belonging to `userAddress`
      const userOwnedNFTs = formattedNFTs.filter((nft) => nft.owner === userAddress.toLowerCase());

      setNFTs(userOwnedNFTs);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError(err.message || "Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  }, [provider, userAddress]); // Ensure `userAddress` triggers re-fetch

  // Track connected account and update `userAddress`
  useEffect(() => {
    if (window.ethereum) {
      const fetchAccount = async () => {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]); // Update account state
        }
      };

      fetchAccount();

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]); // Update state when account switches
        } else {
          setUserAddress(null);
          setNFTs([]); // Clear NFTs when disconnected
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // Re-fetch NFTs when userAddress updates
  useEffect(() => {
    if (userAddress) {
      fetchNFTs();
    } else {
      setNFTs([]); // Clear NFTs if no account connected
    }
  }, [userAddress, fetchNFTs]);

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

  return { nfts, loading, error, refetchNFTs: fetchNFTs };
};

export default useGetAllNFTsByUser;
