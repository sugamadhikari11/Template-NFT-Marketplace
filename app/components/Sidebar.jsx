'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, ChevronLeft, ChevronRight, Home, Settings, PlayCircle, Clock } from "lucide-react";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';

export default function Sidebar({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, setCurrentPage }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.aside 
      initial={{ width: isMounted ? "5rem" : sidebarOpen ? "15rem" : "5rem" }} 
      animate={{ width: sidebarOpen ? "15rem" : "5rem" }} 
      transition={isMounted ? { duration: 0.2, ease: "easeIn" } : { duration: 0 }} 
      className={`relative h-screen p-4 shadow-lg transition-all duration-300 
        ${darkMode ? "bg-gradient-to-b from-gray-700 to-gray-800 text-white" : "bg-gradient-to-b from-gray-200 to-gray-300 text-black"}
      `}
    >
      {/* Collapse Button */}
      <motion.button
        aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        role="button"
        whileHover={{ scale: 1.1, rotate: sidebarOpen ? -15 : 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute -right-4 top-6 p-2 rounded-full shadow-md 
          ${darkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"}
        `}
      >
        {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </motion.button>

      {/* Navigation Links */}
      <ul className="mt-10 space-y-4">
        {[
          { id: "home", icon: <Home />, label: "Home" },
          { id: "manage-nfts", icon: <Settings />, label: "Manage My NFTs" },
          { id: "running-auction", icon: <PlayCircle />, label: "Running Auction" },
          { id: "pending-auction", icon: <Clock />, label: "Pending Auction" }
        ].map((item, index) => (
          <motion.li 
            key={index}
            onClick={() => setCurrentPage(item.id)}
            whileHover={{ scale: 1.1, backgroundColor: darkMode ? "#4B5563" : "#E5E7EB" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center p-3 rounded-lg cursor-pointer transition-all"
            {...(!sidebarOpen && { "data-tooltip-id": "sidebar-tooltip", "data-tooltip-content": item.label })}
          >
            {item.icon}
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: isMounted ? 0 : 1, x: isMounted ? -10 : 0 }} 
                animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -10 }} 
                transition={{ duration: 0.3 }} 
                className="ml-3 text-lg"
              >
                {item.label}
              </motion.span>
            )}
          </motion.li>
        ))}
      </ul>

      {/* Dark Mode Toggle */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(!darkMode)}
        className="mt-10 flex items-center p-3 rounded-lg w-full transition-all"
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        {sidebarOpen && (
          <motion.span 
            initial={{ opacity: isMounted ? 0 : 1, x: isMounted ? -10 : 0 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={isMounted ? { duration: 0.3 } : { duration: 0 }} 
            className="ml-3 text-lg"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </motion.span>
        )}
      </motion.button>

      {/* Tooltip (Only for Collapsed Sidebar) */}
      <Tooltip id="sidebar-tooltip" place="right" />
    </motion.aside>
  );
}
