'use client';

import { useState, useEffect } from "react";

const useSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      if (savedSidebarState) {
        setSidebarOpen(savedSidebarState === "true");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('sidebarOpen', String(sidebarOpen)); // Convert boolean to string
    }
  }, [sidebarOpen]);

  return { isMounted, sidebarOpen, setSidebarOpen };
};

export default useSidebar;
