import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useDarkMode } from '../utilities/useDarkMode';

export default function SwitchModeButton() {
  // theme: "dark" or "light" 
  // toggleTheme: function to switch theme dark/light
  const { theme, toggleTheme } = useDarkMode();

  return(
    <button
      onClick={toggleTheme}
      className="hidden sm:block cursor-pointer relative w-16 h-8 bg-blue-200 dark:bg-gray-600 rounded-full transition duration-[var(--transition-colors-dark-light)] focus:outline-none hover:opacity-50"
    >
      <span
        className={`flex justify-center items-center absolute top-1 left-1 w-6 h-6 dark:bg-[var(--bg-col-dark)] bg-[#fcfcfc] rounded-full shadow-md transform transition-transform duration-[var(--transition-colors-dark-light)] ${theme === "dark" ? 'translate-x-8' : ''
          }`}
      >
        {theme === "dark" ? (
          <MoonIcon className="w-5 h-5 text-yellow-100 transition-all duration-[var(--transition-colors-dark-light)]" />
        ) : (
            <SunIcon className="w-6 h-6 text-yellow-500 transition-all duration-[var(--transition-colors-dark-light)]" />
        )}
      </span>
    </button>
  )
}