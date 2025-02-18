import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import AuctionContractABI from "./AuctionContractABI.json";

const useAuctionContract = (contractAddress, provider) => {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

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

  const addNFT = useCallback(async (nftAddress, tokenId) => {
    if (!contract) return;
    const tx = await contract.addNFT(nftAddress, tokenId);
    await tx.wait();
  }, [contract]);

  const startAuction = useCallback(async (nftAddress, tokenId, minBid, duration) => {
    if (!contract) return;
    const tx = await contract.startAuction(nftAddress, tokenId, minBid, duration);
    await tx.wait();
  }, [contract]);

  const placeBid = useCallback(async (nftAddress, tokenId, bidAmount) => {
    if (!contract) return;
    const tx = await contract.placeBid(nftAddress, tokenId, { value: bidAmount });
    await tx.wait();
  }, [contract]);

  const endAuction = useCallback(async (nftAddress, tokenId) => {
    if (!contract) return;
    const tx = await contract.endAuction(nftAddress, tokenId);
    await tx.wait();
  }, [contract]);

  const revokeAuction = useCallback(async (nftAddress, tokenId) => {
    if (!contract) return;
    const tx = await contract.revokeAuction(nftAddress, tokenId);
    await tx.wait();
  }, [contract]);

  return { contract, addNFT, startAuction, placeBid, endAuction, revokeAuction };
};

export default useAuctionContract;
