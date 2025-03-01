import { useState, useEffect } from "react";

export function useDarkMode({theme, setTheme}) {
    
    useEffect(() => {
        // set "data-theme" attribute to theme for root element – html
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    };
    
    // return function to switch theme
    return toggleTheme;
}
