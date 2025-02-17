'use client';
import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaPaintBrush, FaGlobe, FaCode, FaRocket } from "react-icons/fa";

const LandingPage = ({ setCurrentPage }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      {/* Moving Background Blocks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 overflow-hidden"
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 1000, rotate: Math.random() * 360 }}
            animate={{ y: window.innerHeight, x: Math.random() * 1000, rotate: Math.random() * 360 }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="absolute w-4 h-4 bg-white/10 rounded-full"
          />
        ))}
      </motion.div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center h-screen">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl font-bold mb-4 text-center"
        >
          Welcome to the NFT Auction
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl mb-8 text-center"
        >
          Discover, Mint, and Trade NFTs with ease.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentPage("home")}
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-200 hover:shadow-lg hover:shadow-white/50"
        >
          Get Started
        </motion.button>
      </div>

      {/* Features Section */}
      <div className="relative  min-h-screen overflow-hidden  bg-black/20 min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FaShieldAlt className="w-12 h-12 mb-4" />, title: "Secure Transactions", description: "Blockchain-powered security for all transactions." },
              { icon: <FaPaintBrush className="w-12 h-12 mb-4" />, title: "Easy Minting", description: "Mint your NFTs in just a few clicks." },
              { icon: <FaGlobe className="w-12 h-12 mb-4" />, title: "Global Marketplace", description: "Trade NFTs with users worldwide." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3}}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)" }}
                className="p-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 relative overflow-hidden"
              >
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                <div className="text-center">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">{feature.title}</h3>
                  <p className="text-lg relative z-10">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Knowledge Section */}
      <div className="relative min-h-screen overflow-hidden bg-black/20 min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-center mb-12"
          >
            About the Developer
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)" }}
              className="p-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 relative overflow-hidden"
            >
              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-200" />
              <div className="flex items-center mb-4">
                <FaCode className="w-8 h-8 mr-4" />
                <h3 className="text-2xl font-bold">Who We Are</h3>
              </div>
              <p className="text-lg">
                We are a team of blockchain enthusiasts dedicated to building the future of decentralized NFT marketplaces. Our expertise spans smart contracts, UI/UX design, and blockchain security.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)" }}
              className="p-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 relative overflow-hidden"
            >
              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-200" />
              <div className="flex items-center mb-4">
                <FaRocket className="w-8 h-8 mr-4" />
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-lg">
                To empower creators and collectors by providing a secure, transparent, and user-friendly platform for NFT trading. We aim to revolutionize the digital art and collectibles space.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;