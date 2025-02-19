"use client";
import React from "react";

const BidModal = ({ auction, isOpen, onClose }) => {
  if (!isOpen || !auction) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-3/4 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Bid on {auction.description}</h2>
        <p className="text-sm text-gray-500">Token ID: {auction.tokenId}</p>
        <p className="text-sm font-bold">Starting Price: {auction.startingPrice} ETH</p>

        {/* Input & Submit Bid */}
        <input
          type="number"
          placeholder="Enter bid amount (ETH)"
          className="w-full p-2 border rounded-md mt-4"
        />
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full">
          Submit Bid
        </button>
      </div>
    </div>
  );
};

export default BidModal;
