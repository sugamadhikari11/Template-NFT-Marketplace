'use client'
import { useState } from "react";
import { Moon, Sun, ChevronLeft, ChevronRight, Home, Package, Settings } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ProductsPage from "./components/ProductPage";

export default function MarketplaceUI() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} h-screen overflow-hidden`}>
      <Navbar />
      <div className="flex">
        <div className="h-screen flex-shrink-0">
        <Sidebar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          setCurrentPage={setCurrentPage}
        />
        </div>
        <main className="flex-1 overflow-y-auto h-screen p-6">
          {currentPage === "home" ? <HomePage /> : <ProductsPage />}
        </main>
      </div>
    </div>
  );
}
