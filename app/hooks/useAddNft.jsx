import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import AuctionABI from '../contracts/AuctionAbi.json'; // Import your contract ABI

const AUCTION_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Your contract address

export const useAddNFT = (signer) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const auctionAbi = AuctionABI.abi

  const addNFT = useCallback(
    async (nftAddress, tokenId, description, initialPrice) => {
      if (!signer) return;

      setLoading(true);
      setError(null);
      setTxHash(null);

      const contract = new ethers.Contract(AUCTION_ADDRESS, auctionAbi, signer);

      try {
        const tx = await contract.addNFT(nftAddress, tokenId, description, ethers.parseEther(initialPrice.toString()));
        await tx.wait(); // Wait for the transaction to be mined
        setTxHash(tx.hash); // Store the transaction hash
      } catch (err) {
        setError(err.message || 'Failed to add NFT');
      } finally {
        setLoading(false);
      }
    },
    [signer]
  );

  return { addNFT, loading, error, txHash };
};