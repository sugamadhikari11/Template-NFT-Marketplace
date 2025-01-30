'use client';
import { useState } from "react";
import { Moon, Sun, ChevronLeft, ChevronRight, Home, Package, Settings } from "lucide-react";

export default function Sidebar({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, setCurrentPage }) {
  return (
    <aside className={`relative h-screen p-4 bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-60" : "w-26"}`}>
      {/* Collapse Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-4 top-6 bg-gray-800 p-2 rounded-full shadow-md">
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="mt-10">
        <li className="mb-4 p-2 flex items-center hover:bg-gray-700 rounded cursor-pointer" onClick={() => setCurrentPage("home")}>
          <Home className="w-6 h-6" />
          {sidebarOpen && <span className="ml-2">Home</span>}
        </li>
        <li className="mb-4 p-2 flex items-center hover:bg-gray-700 rounded cursor-pointer" onClick={() => setCurrentPage("products")}>
          <Package className="w-6 h-6" />
          {sidebarOpen && <span className="ml-2">Auction</span>}
        </li>
        <li className="mb-4 p-2 flex items-center hover:bg-gray-700 rounded cursor-pointer">
          <Settings className="w-6 h-6" />
          {sidebarOpen && <span className="ml-2">Settings</span>}
        </li>
      </ul>

      {/* Dark Mode Toggle */}
      <button onClick={() => setDarkMode(!darkMode)} className="mt-10 flex items-center p-2 hover:bg-gray-700 rounded w-full">
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        {sidebarOpen && <span className="ml-2">Dark Mode</span>}
      </button>
    </aside>
  );
}
