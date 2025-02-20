"use client";

import { useState } from "react";
import { ethers } from 'ethers';
import { useMinter } from "../../hooks/useMinterContract";

export default function Home() {
  const [file, setFile] = useState();
  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsData, setIpfsData] = useState({
    imageUrl: "",
    metadataUrl: ""
  });
  const [uploading, setUploading] = useState(false);
  
  // Minting hook
  const { mintNFT, loading: mintLoading, error: mintError, txHash, tokenId, nftAddress } = useMinter();


  const handleUploadAndMint = async () => {
    if (!file || !nftName || !description) {
      alert("Please fill all fields");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", nftName);
    formData.append("description", description);

    try {
      // 1. Upload to IPFS
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const response = await uploadRequest.json();

      if (response.imageUrl && response.ipfsMetadataUri) {
        setIpfsData({
          imageUrl: response.imageUrl,
          metadataUrl: response.metadataUrl
        });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      console.log("tokenuri:", response.ipfsMetadataUri)

      // Mint with all required parameters
      await mintNFT(
        provider, 
        response.ipfsMetadataUri, 
        userAddress
      );
      } else {
        alert(response.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Trouble uploading file");
    } finally {
      setUploading(false);
    }
  };

 

  const handleFileChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  const isLoading = uploading || mintLoading;

  return (
    <main className="w-full min-h-screen flex flex-col pt-20 items-center p-6">
      <div className="p-6 rounded-lg shadow-lg w-full max-w-2xl flex flex-col items-center border border-gray-300">
        <h1 className="text-xl font-semibold mb-4">Mint & Upload NFT</h1>

        {/* Form Elements */}
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="NFT Name"
          value={nftName}
          onChange={(e) => setNftName(e.target.value)}
          className="w-full mb-4 bg-transparent p-2 border border-gray-300 rounded-md"
        />
        <textarea
          placeholder="NFT Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 bg-transparent border border-gray-300 rounded-md"
        />

        {/* Mint Button */}
        <div className="w-full flex justify-center">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleUploadAndMint}
            className={`w-3/4 py-2 rounded-md text-white font-semibold transition ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? (uploading ? "Uploading..." : "Minting...") : "Create NFT"}
          </button>
        </div>

        {/* Transaction Feedback */}
        {mintError && (
          <div className="mt-4 text-red-500 text-sm">
            Error: {mintError}
          </div>
        )}
         
         {txHash && (
          <div className="mt-4 text-sm text-gray-600 break-words">
            Transaction Hash:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              https://sepolia.etherscan.io/tx/{txHash}
            </a>
          </div>
        )}

        {tokenId && (
              <p>Token ID: <span className="font-semibold">{tokenId}</span></p>
        )}
        
        {nftAddress && (
              <p>
                Contract Address:{" "}
                <a
                  href={`https://sepolia.etherscan.io/address/${nftAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {nftAddress}
                </a>
              </p>
            )}


        {/* IPFS Preview */}
        {ipfsData.imageUrl && (
          <div className="mt-4 w-full text-center">
            <p className="text-sm text-gray-600">Uploaded Image:</p>
            <img 
              src={ipfsData.imageUrl} 
              alt="NFT Preview" 
              className="mt-2 rounded-lg shadow-md max-h-48 mx-auto"
            />
          </div>
        )}
      </div>
    </main>
  );
}