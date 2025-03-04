import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useDarkMode } from '../utilities/useDarkMode';

export default function SwitchModeButton({theme, setTheme}) {
    // theme: "dark" or "light" 
    // toggleTheme: function to switch theme dark/light
    const toggleTheme = useDarkMode({theme, setTheme});

    return(
        <button
            onClick={toggleTheme}
            
            aria-label="Toggle dark mode"
            className="relative w-10 h-6 sm:w-16 sm:h-8 rounded-full transition-all duration-700 
                focus:outline-none hover:opacity-50 hover:scale-110 
                bg-blue-200 dark:bg-gray-600 cursor-pointer"
        >
            <span
                className={`absolute top-0.5 left-0.5 flex justify-center items-center w-5 h-5 sm:top-1 sm:left-1 sm:w-6 sm:h-6 dark:bg-[var(--dark)] bg-[#fcfcfc] rounded-full shadow-md transform transition-transform duration-700 ${theme === "dark" ? 'translate-x-4 sm:translate-x-8' : ''}`}
            >
                {theme === "dark" ? (
                    <MoonIcon className="w-5 h-5 sm:w-5 sm:h-5 text-yellow-100" />
                ) : (
                    <SunIcon className="w-6 h-6 text-yellow-500" />
                )} 
            </span>
        </button>
    )
}