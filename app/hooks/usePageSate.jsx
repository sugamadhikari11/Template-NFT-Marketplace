'use client';

import { useState, useEffect } from "react";

export default function usePageState() {
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem("currentPage") || "landing");

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  return { currentPage, setCurrentPage };
}
