'use client';

import { useState } from "react";
// import { ethers } from "ethers";

const LoadNFTPage = () => {
  // const [account, setAccount] = useState<string | null>(null);

  // Connect MetaMask
  // const connectWallet = async () => {
  //   if (typeof window.ethereum !== "undefined") {
  //     try {
  //       const provider = new ethers.BrowserProvider(window.ethereum);
  //       const signer = await provider.getSigner();
  //       const address = await signer.getAddress();
  //       setAccount(address);
  //     } catch (error) {
  //       console.error("Error connecting to MetaMask:", error);
  //     }
  //   } else {
  //     alert("MetaMask is not installed!");
  //   }
  // };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Load My NFTs</h2>
      
      {/* {!account ? (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      ) : (
        <p className="text-green-600">Connected: {account}</p>
      )} */}

      {/* Placeholder until backend is ready */}
      <div className="mt-6 border p-4 rounded w-full max-w-lg text-center">
        <p className="text-gray-500">NFTs will be displayed here once the backend is integrated.</p>
      </div>
    </div>
  );
};

export default LoadNFTPage;
