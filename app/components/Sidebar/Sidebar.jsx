// components/Sidebar.js
'use client';
import { motion } from "framer-motion";
import { Moon, Sun, ChevronLeft, ChevronRight, Home, PlayCircle, Clock } from "lucide-react";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';
import Dropdown from "../ManageNFT/Dropdown"; // Import the Dropdown component
import useSidebar from "../../hooks/useSIdebar"; // Import the custom hook
import NavigationItem from "./NavigationItem"; // Import the NavigationItem component

export default function Sidebar({ darkMode, setDarkMode, setCurrentPage}) {
  const { isMounted, sidebarOpen, setSidebarOpen } = useSidebar();

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
        <NavigationItem
          icon={<Home />}
          label="Home"
          onClick={() => setCurrentPage("home")}
          isOpen={sidebarOpen}
          darkMode={darkMode}
        />
        <Dropdown setCurrentPage={setCurrentPage} isOpen={sidebarOpen} darkMode={darkMode}/>
        <NavigationItem
          icon={<PlayCircle />}
          label="Running Auction"
          onClick={() => setCurrentPage("running-auction")}
          isOpen={sidebarOpen}
          darkMode={darkMode}
        />
        <NavigationItem
          icon={<Clock />}
          label="Pending Auction"
          onClick={() => setCurrentPage("pending-auction")}
          isOpen={sidebarOpen}
          darkMode={darkMode}
        />
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
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
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