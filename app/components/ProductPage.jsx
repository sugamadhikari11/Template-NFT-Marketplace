'use client';
import { useState } from "react";

export default function AuctionPage() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [auctionEnd, setAuctionEnd] = useState("");
  const [image, setImage] = useState(null);
  const [auctions, setAuctions] = useState([]); // Stores all auction items

  const handleAuctionSubmit = () => {
    const newAuction = {
      id: Date.now(),
      itemName,
      itemDescription,
      startingBid,
      auctionEnd,
      image: image ? URL.createObjectURL(image) : null
    };

    setAuctions([...auctions, newAuction]);

    // Reset input fields
    setItemName("");
    setItemDescription("");
    setStartingBid("");
    setAuctionEnd("");
    setImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Create an Auction</h2>

      {/* Item Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Item Name</label>
        <input 
          type="text" 
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      {/* Item Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          value={itemDescription} 
          onChange={(e) => setItemDescription(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      {/* Starting Bid */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Starting Bid ($)</label>
        <input 
          type="number" 
          value={startingBid} 
          onChange={(e) => setStartingBid(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      {/* Auction End Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Auction Ends On</label>
        <input 
          type="datetime-local" 
          value={auctionEnd} 
          onChange={(e) => setAuctionEnd(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      {/* Upload Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload Image (Optional)</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleAuctionSubmit} 
        className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 transition"
      >
        Add Auction Item
      </button>

      {/* Display Auction Items */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-3">Active Auctions</h2>
        {auctions.length === 0 ? (
          <p className="text-gray-400">No auctions available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                {auction.image && (
                  <img src={auction.image} alt={auction.itemName} className="w-full h-40 object-cover rounded mb-2" />
                )}
                <h3 className="text-lg font-bold">{auction.itemName}</h3>
                <p className="text-sm text-gray-300">{auction.itemDescription}</p>
                <p className="text-sm text-yellow-400 mt-2">Starting Bid: ${auction.startingBid}</p>
                <p className="text-sm text-red-400">Ends on: {auction.auctionEnd}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
