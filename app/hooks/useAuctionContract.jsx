import { useState, useEffect, useCallback } from "react";

import { ethers } from "ethers";

import AuctionContractABI from "../contracts/AuctionAbi.json"; // Adjust the path as necessary

import { useMetamask } from "./useMetamask"; // Ensure you have this hook


const useAuctionContract = () => {

  const { provider, signer } = useMetamask(); // Get provider and signer from MetaMask

  const contractAddress = process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS; // Read from .env

  const auctionContractAbi = AuctionContractABI.abi; // Use the ABI from the contract


  const [contract, setContract] = useState(null);

  const [activeAuctions, setActiveAuctions] = useState([]);

  const [pendingAuctions, setPendingAuctions] = useState([]);

  const [endedAuctions, setEndedAuctions] = useState([]);

  const [userNFTs, setUserNFTs] = useState([]);


  useEffect(() => {

    if (provider && contractAddress) {

      const auctionContract = new ethers.Contract(

        contractAddress,

        auctionContractAbi,

        signer // Use the signer from useMetamask

      );

      setContract(auctionContract);

    }

  }, [provider, contractAddress, signer]);


  // Function to add an NFT to the auction

  const addNFT = useCallback(async (nftAddress, tokenId, description, initialPrice) => {

    if (!contract) return;


    try {

      console.log("Adding NFT with the following details:");

      console.log("NFT Address:", nftAddress);

      console.log("Token ID:", tokenId);

      console.log("Description:", description);

      console.log("Initial Price:", initialPrice);


      const tx = await contract.addNFT(nftAddress, tokenId, description, initialPrice);

      console.log("Transaction Hash:", tx.hash);

      await tx.wait();

      console.log("NFT added to auction successfully!");

    } catch (error) {

      console.error("Error adding NFT to auction:", error);

      throw new Error("Failed to add NFT to auction. Please check the console for more details.");

    }

  }, [contract]);

  // Function to start an auction
  const startAuction = useCallback(async (nftId, startingPrice, duration) => {
    if (!contract) return;
    const tx = await contract.startAuction(nftId, startingPrice, duration);
    await tx.wait();
  }, [contract]);

  // Function to place a bid on an auction
  const placeBid = useCallback(async (nftId, bidAmount) => {
    if (!contract) return;
    const tx = await contract.placeBid(nftId, { value: bidAmount });
    await tx.wait();
  }, [contract]);

  // Function to end an auction
  const endAuction = useCallback(async (nftId) => {
    if (!contract) return;
    const tx = await contract.endAuction(nftId);
    await tx.wait();
  }, [contract]);

  // Function to revoke an auction
  const revokeAuction = useCallback(async (nftId) => {
    if (!contract) return;
    const tx = await contract.revokeAuction(nftId);
    await tx.wait();
  }, [contract]);

  // Function to fetch active, pending, and ended auctions
  const fetchAuctions = useCallback(async () => {
    if (!contract) return;
    try {
      const active = await contract.getAllAuctions(0);  // 0 for Active status
      const pending = await contract.getAllAuctions(1);  // 1 for Pending status
      const ended = await contract.getAllAuctions(2);  // 2 for Ended status
      setActiveAuctions(active);
      setPendingAuctions(pending);
      setEndedAuctions(ended);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  }, [contract]);

  // Fetch user NFTs
  const fetchUserNFTs = useCallback(async () => {
    if (!contract) return;
    try {
      const nfts = await contract.getAllNFTsByUser();
      setUserNFTs(nfts);
    } catch (error) {
      console.error("Error fetching user NFTs:", error);
    }
  }, [contract]);

  // Use the fetchAuctions and fetchUserNFTs on mount to populate state
  useEffect(() => {
    fetchAuctions();
    fetchUserNFTs();
  }, [fetchAuctions, fetchUserNFTs]);

  return {
    addNFT,
    startAuction,
    placeBid,
    endAuction,
    revokeAuction,
    activeAuctions,
    pendingAuctions,
    endedAuctions,
    userNFTs,
    fetchUserNFTs
  };
};

export default useAuctionContract;
