'use client';
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ManageNFTsPage from "./components/ManageNFTsPage";
import RunningAuctionPage from "./components/RunningAuctionPage";
import PendingAuctionPage from "./components/PendingAuctionPage";

export default function MarketplaceUI() {
  const [darkMode, setDarkMode] = useState(()=>{
    return localStorage.getItem("darkMode")=="true";
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem('sidebarOpen') === "true";  // Convert to boolean
  });  
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || "home";
  });

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(sidebarOpen)); // Convert boolean to string
  }, [sidebarOpen]);
  
  useEffect(()=>{
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} h-screen overflow-hidden`}>
      <Navbar darkMode={darkMode} />
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
          {currentPage === "home" && <HomePage />}
          {currentPage === "manage-nfts" && <ManageNFTsPage />}
          {currentPage === "running-auction" && <RunningAuctionPage />}
          {currentPage === "pending-auction" && <PendingAuctionPage />}
        </main>
      </div>
    </div>
  );
}
