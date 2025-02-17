'use client';

import { useState, useEffect } from "react";

export default function usePageState() {
  const [currentPage, setCurrentPage] = useState("landing");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("currentPage");
      if (savedPage) {
        setCurrentPage(savedPage);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", currentPage);
    }
  }, [currentPage]);

  return { currentPage, setCurrentPage };
}
