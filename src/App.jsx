import React, { useState, useEffect, memo } from "react";
import HeaderSection from "./components/sections/HeaderSection";
import TestSection from './components/sections/TestSection';
import ModeButton from './components/ModeButton';
import ReadFileCsv from './utilities/readFileCsv';
import StudyComponent from './components/StudyComponent'

const MemoTestSection = memo(TestSection);
const MemoHeaderSection = memo(HeaderSection);

export default function App() {
    const [testMode, setTestMode] = useState(null); // sets test mode: manual or choice
    const [selectedPart, setSelectedPart] = useState("all"); // sets part of speech
    const [selectedTheme, setSelectedTheme] = useState("all"); // sets theme
    const [uniqueParts, setUniqueParts] = useState([]); // unique parts of speech array to prevent repeating
    const [currentItem, setCurrentItem] = useState(0); // array to know current item (word)
    const [trigger, setTrigger] = useState(false); // switcher for refreshing work array from MainSection
    const [workMode, setWorkMode] = useState(null); // work mode: test or study
    const [wordsData, setWordsData] = useState([]); // main array from file
    const [settingsVisible, setSettingsVisible] = useState(false); // state to show/hide settings window
    const [sound, setSound] = useState(true); // state for speak function on buttons prev/next in study mode
    const [showApiExamples, setShowApiExamples] = useState(false);

    // defines system theme
    const getSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme") || getSystemTheme());

    // get data from csv file
    useEffect(() => {
        async function loadData() {
            try {
                const data = await ReadFileCsv();
                setWordsData(data);
            } catch (error) {
                console.log("Failed to load data. Please try again later.");
            }
        }
        loadData();
    }, []);

    function resetAll() {
        setTrigger(prev => !prev)
        setTestMode(null);
        setSelectedPart("all");
        setSelectedTheme("all");
        setUniqueParts([]);
        setCurrentItem(0);
        setWorkMode(null);
        setSettingsVisible(false);
    }

    // props for components
    const settings = {
        setWorkMode,
        wordsData,
        setUniqueParts,
        testMode,
        setTestMode,
        uniqueParts,
        selectedPart,
        selectedTheme,
        setSelectedPart,
        setSelectedTheme,
        currentItem,
        setCurrentItem,
        sound,
        setSound,
        showApiExamples,
        trigger
    }

    return (
        <>
            {settingsVisible && <SettingsWindow showApiExamples={showApiExamples} setShowApiExamples={setShowApiExamples} sound={sound} setSound={setSound} theme={theme} setTheme={setTheme} setSettingsVisible={setSettingsVisible} resetAll={resetAll} /> }
            <div className='flex flex-col min-h-[100dvh] container'>
                <MemoHeaderSection theme={theme} setTheme={setTheme} setSettingsVisible={setSettingsVisible} logoClick={() => resetAll()}>EnglishMan</MemoHeaderSection>
                <main className='flex flex-col items-center justify-center grow'>
                    {!workMode && <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--light)] text-[var(--dark)] text-center mb-5">
                            Hello! Glad to welcome you to EnglishMan! <br className=' hidden sm:block' />
                            Start learning new words right now!
                        </h1>
                        <div className="mt-7 flex justify-center gap-5 flex-wrap">
                            {["study", "test"].map(mode => (
                                <ModeButton
                                    key={mode}
                                    onClick={() => setWorkMode(mode)}
                                    isActive={workMode === mode}
                                >
                                    <span className="sm:hidden">{mode === "study" ? "Study 📚" : "Test ✍️"}</span>
                                    <span className="hidden sm:inline">
                                        {mode === "study" ? "Study Mode 📚" : "Test Mode ✍️"}
                                    </span>
                                </ModeButton>
                            ))}
                        </div>
                    </div>}
                    {workMode === "test" &&
                        <MemoTestSection {...settings} />
                    }
                    {workMode === "study" &&
                        <StudyComponent {...settings} />
                    }
                </main>
                <footer className="grow-0 text-[var(--dark)] dark:text-[var(--light)] text-s p-5 w-full text-center font-semibold">
                    Kyiv {new Date().getFullYear()}
                </footer>
            </div>  
        </>
    );
}


const SettingsWindow = ({
    theme,
    setTheme,
    setSettingsVisible,
    resetAll,
    sound,
    setSound,
    showApiExamples,
    setShowApiExamples,
}) => {
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setSettingsVisible(false);
        }
    };

    return (
        <div
            className="fixed z-51 inset-0 flex flex-col justify-center items-center w-full min-h-[100dvh] backdrop-blur-lg container overflow-hidden"
        >
            <MemoHeaderSection
                theme={theme}
                setTheme={setTheme}
                setSettingsVisible={setSettingsVisible}
                logoClick={(e) => {
                    e.stopPropagation();
                    resetAll();
                }}
                onClick={(e) => e.stopPropagation()}
            >
                EnglishMan
            </MemoHeaderSection>
            <div 
                className="grow flex flex-col gap-5 justify-center items-center"
                onClick={handleBackgroundClick}
            >
                <button
                    className="buttonStyle text-4xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSound((prev) => !prev);
                    }}
                >
                    {sound ? "Sound DISABLED 🔇" : "Sound ENABLED 🔊"}
                </button>
                <button
                    className="buttonStyle text-4xl sm:text-4xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowApiExamples((prev) => !prev);
                    }}
                >
                    {showApiExamples
                        ? "Examples from API DISABLED ❌"
                        : "Examples from API ENABLED ✅"}
                </button>
            </div>
        </div>
    );
};

