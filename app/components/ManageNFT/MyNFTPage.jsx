import React from 'react';
import useGetAllNFTsByUser from '../../hooks/useGetAllNFTsByUSER';
import { useMetamask } from '../../hooks/useMetamask'; // Assuming you have a hook to get the provider and user address

const NFTList = () => {
  const { provider, userAddress } = useMetamask();
  const { nfts, loading, error } = useGetAllNFTsByUser(provider, userAddress);

  if (loading) return <p>Loading NFTs...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Your NFTs</h2>
      {nfts.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <ul>
          {nfts.map((nft, index) => (
            <li key={index}>
              <p>Token ID: {nft.tokenId.toString()}</p>
              <p>Description: {nft.description}</p>
              <p>Price: {ethers.utils.formatEther(nft.price)} ETH</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NFTList;