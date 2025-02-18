import { useState, useEffect } from "react";
import { ethers } from "ethers";
import AuctionABI from "../contracts/AuctionAbi.json";

const contractAddress = process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS;

export function useAuctionContract(provider, account) {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (!provider) {
          setError("No provider found");
          return;
        }
        if (!account) {
          setError("No account connected");
          return;
        }
        if (!contractAddress) {
          setError("Contract address is missing");
          return;
        }

        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, AuctionABI, signer);
        setContract(contractInstance);
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError(err.message);
      }
    };

    initializeContract();
  }, [provider, account]);

  return { contract, error };
}
