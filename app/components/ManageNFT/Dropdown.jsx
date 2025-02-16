import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";

const Dropdown = ({ setCurrentPage, isOpen, darkMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelect = (page) => {
    setCurrentPage(page);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full md:w-auto">
      {/* Dropdown Trigger */}
      <motion.li
        onClick={handleToggle}
        whileHover={{ scale: 1.1, backgroundColor: darkMode ? "#4B5563" : "#fff" }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center p-3 rounded-lg cursor-pointer transition-all"
      >
        <Settings />
        {isOpen && <span className="ml-3 text-lg">Manage My NFTs</span>}
      </motion.li>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute left-0 mt-2 w-full md:w-48 shadow-lg rounded-lg overflow-hidden
              ${darkMode ? "bg-gradient-to-b from-gray-700 to-gray-800 text-white" : "bg-gradient-to-b from-gray-200 to-gray-300 text-black"}
            `}
          >
            <button
              onClick={() => handleSelect("load-nft")}
              className="block w-full text-left px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-400"
            >
              Load NFT
            </button>
            <button
              onClick={() => handleSelect("mint-nft")}
              className="block w-full text-left px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-400"
            >
              Mint NFT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
