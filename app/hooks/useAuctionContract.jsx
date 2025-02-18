// hooks/useAuctionContract.ts
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import AuctionContractABI from "./AuctionContractABI.json"; // Adjust the path as necessary
import { useMetaMask } from "./useMetaMask"; // Ensure you have this hook

const useAuctionContract = () => {
  const { provider } = useMetaMask(); // Get provider from MetaMask
  const contractAddress = process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS; // Read from .env

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    if (provider && contractAddress) {
      const signerInstance = provider.getSigner();
      setSigner(signerInstance);
      const auctionContract = new ethers.Contract(
        contractAddress,
        AuctionContractABI,
        signerInstance
      );
      setContract(auctionContract);
    }
  }, [provider, contractAddress]);

  const addNFT = useCallback(async (nftAddress, tokenId, description, initialPrice) => {
    if (!contract) return;
    const tx = await contract.addNFT(nftAddress, tokenId, description, initialPrice);
    await tx.wait();
  }, [contract]);

  const startAuction = useCallback(async (nftId, startingPrice, duration) => {
    if (!contract) return;
    const tx = await contract.startAuction(nftId, startingPrice, duration);
    await tx.wait();
  }, [contract]);

  const placeBid = useCallback(async (nftId, bidAmount) => {
    if (!contract) return;
    const tx = await contract.placeBid(nftId, { value: bidAmount });
    await tx.wait();
  }, [contract]);

  const endAuction = useCallback(async (nftId) => {
    if (!contract) return;
    const tx = await contract.endAuction(nftId);
    await tx.wait();
  }, [contract]);

  const revokeAuction = useCallback(async (nftId) => {
    if (!contract) return;
    const tx = await contract.revokeAuction(nftId);
    await tx.wait();
  }, [contract]);

  return { contract, addNFT, startAuction, placeBid, endAuction, revokeAuction };
};

export default useAuctionContract;