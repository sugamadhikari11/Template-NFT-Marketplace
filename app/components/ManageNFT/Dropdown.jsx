// components/Dropdown.js
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react"; // Import the Settings icon

const Dropdown = ({ setCurrentPage, isOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (page) => {
    setCurrentPage(page);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative">
      <motion.li
        onClick={handleToggle}
        whileHover={{ scale: 1.1, backgroundColor: "#4B5563" }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center p-3 rounded-lg cursor-pointer transition-all"
      >
        <Settings />
        {isOpen && (
          <span className="ml-3 text-lg">Manage My NFTs</span>
        )}
      </motion.li>
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-md">
          <motion.button
            onClick={() => handleSelect("load-nft")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Load NFT
          </motion.button>
          <motion.button
            onClick={() => handleSelect("mint-nft")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Mint NFT
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;