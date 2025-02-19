import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../../app/contracts/AuctionAbi.json"; // Ensure correct ABI import

const usePlaceBid = (contractAddress) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeBid = async (nftId, bidAmount, signer) => {
    if (!signer) {
      setError("No signer found. Connect your wallet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      // Convert bidAmount to Wei
      const bidInWei = ethers.parseEther(bidAmount.toString());

      const tx = await contract.placeBid(nftId, { value: bidInWei });

      await tx.wait(); // Wait for transaction confirmation

      setLoading(false);
      return tx;
    } catch (err) {
      console.error("Error placing bid:", err);
      setError(err.reason || err.message);
      setLoading(false);
    }
  };

  return { placeBid, loading, error };
};

export default usePlaceBid;
