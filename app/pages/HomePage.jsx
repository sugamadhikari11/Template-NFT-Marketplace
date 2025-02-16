"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const radius = 400; // Adjust radius as needed

  const upcomingAuctions = [
    { id: 1, title: "Auction 1", image: "logo.png", link: "/auction/1" },
    { id: 2, title: "Auction 2", image: "image2.jpg", link: "/auction/2" },
    { id: 3, title: "Auction 3", image: "image3.jpg", link: "/auction/3" },
    { id: 4, title: "Auction 4", image: "image4.jpg", link: "/auction/4" },
    { id: 5, title: "Auction 5", image: "image5.jpg", link: "/auction/5" },
    { id: 6, title: "Auction 6", image: "image6.jpg", link: "/auction/6" },
    { id: 7, title: "Auction 7", image: "image7.jpg", link: "/auction/7" },
    { id: 8, title: "Auction 8", image: "image8.jpg", link: "/auction/8" },
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % upcomingAuctions.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + upcomingAuctions.length) % upcomingAuctions.length);
  };

  const handleImageClick = (index) => {
    setActiveIndex(index);
  };

  const itemVariants = {
    enter: (index) => {
      const angle =
        ((index - activeIndex + upcomingAuctions.length) %
          upcomingAuctions.length) *
        (360 / upcomingAuctions.length + 5);
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
      const angle =
        ((index - activeIndex + upcomingAuctions.length) %
          upcomingAuctions.length) *
        (360 / upcomingAuctions.length + 5);
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
        <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Auctions</h2>
        <div className="relative w-full h-[600px] p-10 flex items-center justify-center">
          {upcomingAuctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              className="absolute w-64 h-80 rounded-lg shadow-xl overflow-hidden cursor-pointer flex flex-col items-center"
              variants={itemVariants}
              custom={index}
              initial="enter"
              animate={index === activeIndex ? "center" : "exit"}
              onClick={() => handleImageClick(index)}
            >
              <a href={auction.link} className="bg-blue-500 text-white py-2 px-4 rounded-md mb-2 hover:bg-blue-600">Go to Auction</a>
              <img
                src={auction.image}
                alt={auction.title}
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Navigation buttons */}
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
      </section>
    </div>
  );
}
