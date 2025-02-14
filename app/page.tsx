'use client';

import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./DashboardLayout";
import useSidebar from "../app/hooks/useSIdebar";
import useTheme from "../app/hooks/useTheme";  
import usePageState from "../app/hooks/usePageSate";  

export default function MarketplaceUI() {
  const { darkMode, setDarkMode } = useTheme();  
  const { isMounted } = useSidebar();
  const { currentPage, setCurrentPage } = usePageState();  

  if (!isMounted) return null;

  return currentPage === "landing" ? (
    <LandingPage setCurrentPage={setCurrentPage} />
  ) : (
    <DashboardLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
    />
  );
}
