'use client'
import { useState, useEffect } from "react";

const useSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') === "true");

  

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(sidebarOpen)); // Convert boolean to string
  }, [sidebarOpen]);

  return { isMounted, sidebarOpen, setSidebarOpen };
};

export default useSidebar;