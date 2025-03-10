import { useEffect } from "react";

export function useDarkMode({theme, setTheme}) {
    
    useEffect(() => {
        // set "data-theme" attribute to theme for root element – html
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            localStorage.setItem('themeColor', "dark");
        } else {
            setTheme("light");
            localStorage.setItem('themeColor', "light");
        }
    };
    
    // return function to switch theme
    return toggleTheme;
}
