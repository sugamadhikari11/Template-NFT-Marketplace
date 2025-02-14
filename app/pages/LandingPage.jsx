import React from "react";

const LandingPage = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to the NFT Marketplace</h1>
      <p className="text-lg mb-6">Discover, Mint, and Trade NFTs with ease.</p>
      <button
        onClick={() => setCurrentPage("dashboard")}
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
