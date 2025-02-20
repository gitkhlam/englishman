import { useState, useEffect } from "react";

export function useDarkMode() {
  // defines system theme
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [theme, setTheme] = useState(getSystemTheme());

  useEffect(() => {
    // set "data-theme" attribute to theme for root element – html
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };
  // return theme and function to switch theme
  return { theme, toggleTheme };
}
