'use client';

import { useState, useEffect } from "react";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return { darkMode, setDarkMode };
}
