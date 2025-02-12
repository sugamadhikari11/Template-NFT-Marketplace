'use client';

import { motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const radius = 500; // Adjust radius as needed

  const upcomingAuctions = [
    // Example auction items
    { id: 1, title: "Auction 1", image: "logo.png" },
    { id: 2, title: "Auction 2", image: "image2.jpg" },
    { id: 3, title: "Auction 3", image: "image3.jpg" },
    { id: 4, title: "Auction 4", image: "image4.jpg" },
    { id: 5, title: "Auction 4", image: "image4.jpg" },
    { id: 6, title: "Auction 4", image: "image4.jpg" },
    { id: 7, title: "Auction 4", image: "image4.jpg" },
    { id: 8, title: "Auction 4", image: "image4.jpg" },
    { id: 9, title: "Auction 4", image: "image4.jpg" },
    { id: 10, title: "Auction 4", image: "image4.jpg" },
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % upcomingAuctions.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + upcomingAuctions.length) % upcomingAuctions.length);
  };

  const itemVariants = {
    enter: (index) => {
      const angle = ((index - activeIndex + upcomingAuctions.length) % upcomingAuctions.length) * (360 / upcomingAuctions.length);
      const x = radius * Math.cos(angle * Math.PI / 180);
      const y = radius * Math.sin(angle * Math.PI / 180);

      return {
        x: x,
        y: y,
        rotateY: 0,
        scale: 0.8,
        opacity: 0.5,
        zIndex: 1,
        transition: { duration: 0.6, ease: "easeInOut" }
      };
    },
    center: {
      x: 0,
      y: 0,
      rotateY: 0,
      scale: 1.2,
      opacity: 1,
      zIndex: 10,
      transition: { duration: 0.6, ease: "easeInOut" }
    },
    exit: (index) => {
      const angle = ((index - activeIndex + upcomingAuctions.length) % upcomingAuctions.length) * (360 / upcomingAuctions.length);
      const x = radius * Math.cos(angle * Math.PI / 180);
      const y = radius * Math.sin(angle * Math.PI / 180);

      return {
        x: x,
        y: y,
        rotateY: 0,
        scale: 0.8,
        opacity: 0.5,
        zIndex: 1,
        transition: { duration: 0.6, ease: "easeInOut" }
      };
    }
  };

  return (
    <div className="space-y-8 mb-10">
      <section className="relative">
        <h2 className="text-2xl font-bold mb-4">Upcoming Auctions</h2>
        <div className="relative w-full h-[400px] perspective-[1000px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {upcomingAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                className={`absolute w-64 h-80 rounded-lg shadow-xl overflow-hidden`}
                variants={itemVariants}
                custom={index}
                initial="enter"
                animate={index === activeIndex ? "center" : "exit"}
              >
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <button onClick={handlePrev} className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600">
            &lt;
          </button>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <button onClick={handleNext} className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600">
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
}