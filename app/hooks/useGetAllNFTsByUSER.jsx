import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AuctionABI from "../contracts/AuctionAbi.json";

const contractAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

const useGetAllNFTsByUser = (provider, userAddress) => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provider || !userAddress) return;

    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);

      try {
        const contract = new ethers.Contract(contractAddress, AuctionABI.abi, provider);

        // 🔥 Correct function call (view function doesn't need signer)
        const userNFTs = await contract.getAllNFTsByUser();

        // 🔄 Convert BigNumbers and format data
        const formattedNFTs = userNFTs.map(nft => ({
          tokenId: nft.tokenId.toString(),
          nftAddress: nft.nftAddress,
          owner: nft.owner,
          description: nft.description,
          image: nft.image ? nft.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") : null,
          initialPrice: ethers.formatEther(nft.initialPrice),
        }));

        setNFTs(formattedNFTs);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError(err.message || "Failed to fetch NFTs");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [provider, userAddress]);

  return { nfts, loading, error };
};

export default useGetAllNFTsByUser;
