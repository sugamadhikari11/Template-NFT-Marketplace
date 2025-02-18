import { useState } from 'react';
import { ethers } from 'ethers';
import minterABI from '../contracts/MinterAbi.json'; // Ensure ABI matches your contract
import { CONTRACT_ADDRESS } from '../../utils/config';

export const useMinter = () => {
  const [mintState, setMintState] = useState({
    loading: false,
    error: null,
    txHash: null,
    tokenId: null,
    nftAddress: null
  });
  const mintabi =  minterABI.abi;

  const mintNFT = async (provider, metadataUrl, recipientAddress) => {
    if (!provider || !metadataUrl || !recipientAddress) {
      setMintState(s => ({ ...s, error: "Missing required parameters" }));
      return;
    }

    setMintState({ loading: true, error: null, txHash: null, tokenId: null, nftAddress: null });

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, mintabi, signer);
      
      // Match the contract's function signature
      const tx = await contract.mintNFT(metadataUrl, recipientAddress);
      setMintState(s => ({ ...s, txHash: tx.hash }));
      
      const receipt = await tx.wait();
      
      // Extract tokenId from transaction logs
      const event = receipt.logs.find(log => 
        log.fragment.name === "NFTMinted" &&
        log.address === CONTRACT_ADDRESS
      );
      
      const tokenId = event?.args.tokenId.toString();
      const nftAddress = CONTRACT_ADDRESS;
      
      setMintState(s => ({ ...s, tokenId, nftAddress }));
      return { tx, tokenId , nftAddress};
    } catch (error) {
      setMintState(s => ({
        ...s,
        error: error.reason || error.message || "Minting failed"
      }));
    } finally {
      setMintState(s => ({ ...s, loading: false }));
    }
  };

  return { mintNFT, ...mintState };
};