// components/NavigationItem.js
import { motion } from "framer-motion";

const NavigationItem = ({ icon, label, onClick, isOpen, darkMode }) => {
  return (
    <motion.li
      onClick={onClick}
      whileHover={{ scale: 1.1, backgroundColor: darkMode ? "#4B5563" : "#fff" }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center p-3 rounded-lg cursor-pointer transition-all"
    >
      
      {icon}
      {isOpen && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="ml-3 text-lg"
        >
          {label}
        </motion.span>
      )}
    </motion.li>
  );
};

export default NavigationItem;