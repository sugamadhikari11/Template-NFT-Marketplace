import React, { useEffect, useState } from "react";
import useAuctionContract from "../../hooks/useAuctionContract"; // Adjust the path as necessary
import { ethers } from "ethers";

const UserNFTsPage = () => {
  const { userNFTs, fetchUserNFTs } = useAuctionContract(); // Get user NFTs and fetch function
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTs = async () => {
      setLoading(true);
      try {
        console.log("Fetching user NFTs...");
        await fetchUserNFTs(); // Fetch user NFTs
      } catch (error) {
        console.error("Error loading NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [fetchUserNFTs]); // Fetch user NFTs on component mount

  if (loading) {
    return <div>Loading your NFTs...</div>;
  }

  return (
    <div>
      <h1>Your NFTs</h1>
      {userNFTs.length === 0 ? (
        <p>You don't own any NFTs.</p>
      ) : (
        <div>
          {userNFTs.map((nft, index) => (
            <div key={index} className="nft-item">
              <h3>{nft.description}</h3>
              <p>
                Token ID: {nft.tokenId} <br />
                Price: {ethers.utils.formatEther(nft.initialPrice)} ETH
              </p>
              <img src={nft.imageUrl} alt={`NFT ${nft.tokenId}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNFTsPage;