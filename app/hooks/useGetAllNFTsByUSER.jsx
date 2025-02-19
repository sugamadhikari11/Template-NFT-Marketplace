import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import AuctionABI from '../contracts/AuctionAbi.json'; // Import your contract ABI

const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // Your contract address


// Replace with your contract's ABI and address
const contractABI = AuctionABI.abi

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
        // Create a contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Call the `getAllNFTsByUser` function
        const nfts = await contract.getAllNFTsByUser({ from: userAddress });

        // Update state with the fetched NFTs
        setNFTs(nfts);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError(err.message || 'Failed to fetch NFTs');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [provider, userAddress]);

  return { nfts, loading, error };
};

export default useGetAllNFTsByUser;