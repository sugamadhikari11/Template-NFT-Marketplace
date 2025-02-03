'use client';
import { Moon, Sun, ChevronLeft, ChevronRight, Home, Package, Settings, PlayCircle, Clock } from "lucide-react";

export default function Sidebar({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, setCurrentPage }) {
  return (
    <aside className={`relative h-screen p-4 shadow-lg transition-all duration-300 
      ${sidebarOpen ? "w-60" : "w-20"} 
      ${darkMode ? "bg-gray-700 text-white shadow-lg" : "bg-gray-200 text-black shadow-lg"}
    `}>
      {/* Collapse Button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className={`absolute -right-4 top-6 p-2 rounded-full shadow-md 
            ${darkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"}
          `}
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="mt-10">
        <li 
          className={`mb-4 p-2 flex items-center rounded cursor-pointer 
            ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`} 
          onClick={() => setCurrentPage("home")}
        >
          <Home className="w-6 h-6" />
          {sidebarOpen && <span className="ml-2">Home</span>}
        </li>

        <li 
          className={`mb-4 p-2 flex items-center rounded cursor-pointer 
            ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`} 
          onClick={() => setCurrentPage("manage-nfts")}
        >
          <Settings className="w-6 h-6" />
          {sidebarOpen && <span className="ml-2">Manage My NFTs</span>}
        </li>

        <li 
          className={`mb-4 p-2 flex items-center rounded cursor-pointer 
            ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`} 
          onClick={() => setCurrentPage("running-auction")}
        >
          <PlayCircle className="w-6 h-6" />
          {sidebarOpen && <span className="ml-2">Running Auction</span>}
        </li>

        <li 
          className={`mb-4 p-2 flex items-center rounded cursor-pointer 
            ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`} 
          onClick={() => setCurrentPage("pending-auction")}
        >
          <Clock className="w-6 h-6" />
          {sidebarOpen && <span className="ml-2">Pending Auction</span>}
        </li>
      </ul>

      {/* Dark Mode Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)} 
        className={`mt-10 flex items-center p-2 rounded w-full 
          ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        {sidebarOpen && <span className="ml-2">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
      </button>
    </aside>
  );
}
