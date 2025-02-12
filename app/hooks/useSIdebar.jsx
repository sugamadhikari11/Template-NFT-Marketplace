// hooks/useSidebar.js
import { useState, useEffect } from "react";

const useSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem('sidebarOpen') === "true"; // Convert to boolean
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(sidebarOpen)); // Convert boolean to string
  }, [sidebarOpen]);

  return { isMounted, sidebarOpen, setSidebarOpen };
};

export default useSidebar;