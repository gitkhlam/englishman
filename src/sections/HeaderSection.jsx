import SwitchColorModeButton from "../components/SwitchColorModeButton";
import { CogIcon } from "@heroicons/react/24/solid";

export default function HeaderSection({ settingsVisible, setSettingsVisible, logoClick, theme, setTheme, children }) {
    const toggleSettings = () => setSettingsVisible(prev => !prev);

    return (
        <header
            className={`sticky top-0 left-0 w-full z-10 border-white/10 backdrop-blur-3xl transition-opacity duration-300  
                ${settingsVisible ? "opacity-0" : "opacity-100"}`}
        >
            <div className="flex justify-between items-center py-6 gap-x-4 container">
                <span
                    className="select-none text-4xl font-bold text-[var(--dark)] dark:text-[var(--light)] cursor-pointer break-all inline-block 
                        transition-transform duration-500 hover:translate-x-[1px] hover:translate-y-[1px] hover:[text-shadow:2px_2px_5px_rgba(213,213,213,0.3)] 
                        hover:scale-108 logo-text hover:opacity-30"
                    onClick={logoClick}
                >
                    {children}
                </span>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <SwitchColorModeButton theme={theme} setTheme={setTheme} />

                    <button
                        className="cursor-pointer transition-all duration-700 hover:opacity-30 hover:rotate-[360deg] hover:scale-110"
                        onClick={toggleSettings}
                        aria-label="Toggle settings"
                    >
                        <CogIcon className="w-10 h-10 sm:w-12 sm:h-12 dark:text-blue-100 text-[var(--dark)]" />
                    </button>
                </div>
            </div>
        </header>
    );
}
