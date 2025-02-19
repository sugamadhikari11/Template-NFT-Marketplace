'use client';

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import LoadNFTPage from "./components/ManageNFT/LoadNFTPage";
import MintNFTPage from "./components/ManageNFT/MintNFTPage";
import MyNFTPage from "./components/ManageNFT/MyNFTPage";
import RunningAuctionPage from "./pages/RunningAuctionPage";
import PendingAuctionPage from "./pages/PendingAuctionPage";
import EndedAuctionPage from "./pages/EndedAuctionPage";
import "./globals.css";


const DashboardLayout = ({ darkMode, setDarkMode, currentPage, setCurrentPage }) => {
  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} h-screen overflow-hidden`}>
      <Navbar setCurrentPage={setCurrentPage} darkMode={darkMode} />
      <div className="flex">
        <div className="h-screen flex-shrink-0">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} setCurrentPage={setCurrentPage} />
        </div>
        <main className="flex-1 overflow-y-auto h-screen p-6">
          {currentPage === "home" && <HomePage />}
          {currentPage === "load-nft" && <LoadNFTPage />} 
          {currentPage === "mint-nft" && <MintNFTPage />} 
          {currentPage === "my-nft" && <MyNFTPage />} 
          {currentPage === "running-auction" && <RunningAuctionPage />}
          {currentPage === "pending-auction" && <PendingAuctionPage />}
          {currentPage === "ended-auction" && <EndedAuctionPage />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
