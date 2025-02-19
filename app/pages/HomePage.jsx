"use client";
import "../globals.css";


import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import useGetAllAuctionsByStatus from "../hooks/useGetAllAuctionByStatus";

export default function HomePage() {
  const [provider, setProvider] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const radius = 400; // Adjust radius as needed

  // Load provider for ethers.js
  useEffect(() => {
    if (!window.ethereum) return;
    const loadProvider = async () => {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    };
    loadProvider();
  }, []);

  // Fetch auctions when provider is ready
  const { auctions: pendingAuctions, loading: loadingPending } = useGetAllAuctionsByStatus(provider, "Pending");
  const { auctions: startedAuctions, loading: loadingStarted } = useGetAllAuctionsByStatus(provider, "Active");

  // Merge auctions
  const allAuctions = [...(pendingAuctions || []), ...(startedAuctions || [])];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % allAuctions.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + allAuctions.length) % allAuctions.length);
  };

  const handleImageClick = (index) => {
    setActiveIndex(index);
  };

  const itemVariants = {
    enter: (index) => {
      const angle = ((index - activeIndex + allAuctions.length) % allAuctions.length) * (360 / allAuctions.length + 5);
      const x = radius * Math.cos((angle * Math.PI) / 180);
      const y = radius * Math.sin((angle * Math.PI) / 180);
      return {
        x,
        y,
        scale: 0.8,
        opacity: 0.5,
        zIndex: 1,
        transition: { duration: 0.6, ease: "easeInOut" },
      };
    },
    center: {
      x: 0,
      y: 0,
      scale: 1.2,
      opacity: 1,
      zIndex: 10,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: (index) => {
      const angle = ((index - activeIndex + allAuctions.length) % allAuctions.length) * (360 / allAuctions.length + 5);
      const x = radius * Math.cos((angle * Math.PI) / 180);
      const y = radius * Math.sin((angle * Math.PI) / 180);
      return {
        x,
        y,
        scale: 0.8,
        opacity: 0.5,
        zIndex: 1,
        transition: { duration: 0.6, ease: "easeInOut" },
      };
    },
  };

  return (
    <div className="space-y-8 mb-10">
      <section className="relative">
        <h2 className="text-2xl font-bold mb-4 text-center">Auctions Available</h2>

        {/* Loading State */}
        {loadingPending || loadingStarted ? (
          <p className="text-center">Loading auctions...</p>
        ) : allAuctions.length === 0 ? (
          <p className="text-center">No auctions available.</p>
        ) : (
          <div className="relative w-full h-[600px] p-10 flex items-center justify-center">
            {allAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                className="absolute w-64 h-80 rounded-lg shadow-xl overflow-hidden cursor-pointer flex flex-col items-center bg-white"
                variants={itemVariants}
                custom={index}
                initial="enter"
                animate={index === activeIndex ? "center" : "exit"}
                onClick={() => handleImageClick(index)}
              >
               <a
                  href={`/auction/${auction.id}`}
                  className="relative px-6 py-3 font-bold text-white bg-orange-300 rounded-md transition-all duration-300 ease-in-out hover:bg-orange-500 group"
                >
                  View Auction
                  <span className="absolute inset-0 w-full h-full bg-transparent border-2 border-white rounded-md animate-wave"></span>
                </a>

                {auction.image ? (
                  <img
                    src={auction.image}
                    alt={auction.description}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <p className="text-gray-500">No image available</p>
                )}
                <h3 className="text-lg font-semibold mt-2">
                  {auction.description || "Untitled Auction"}
                </h3>
                <p className="text-sm font-bold">Price: {auction.startingPrice} ETH</p>
                <p className="text-sm text-gray-500">Status: {auction.status}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        {allAuctions.length > 1 && (
          <>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button
                onClick={handlePrev}
                className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
              >
                &lt;
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <button
                onClick={handleNext}
                className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
