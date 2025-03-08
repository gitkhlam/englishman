import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import HeaderSection from "./sections/HeaderSection";
import TestSection from './sections/TestSection';
import ModeButton from './components/WorkModeButton';
import ReadFileCsv from './utilities/readFileCsv';
import StudySection from './sections/StudySection'
import SpreadsheetParser from './utilities/SpreadSheetParse';
import SettingsWindow from './sections/SettingsWindow';
import Preloader from './sections/Preloader';

import { motion, AnimatePresence } from "framer-motion";

const MemoTestSection = memo(TestSection);

export default function App() {
    const [testMode, setTestMode] = useState(null); // sets test mode: manual or choice
    const [selectedPart, setSelectedPart] = useState("all"); // sets part of speech
    const [selectedTheme, setSelectedTheme] = useState("all"); // sets theme of speech
    const [uniqueParts, setUniqueParts] = useState([]); // unique parts of speech array to prevent repeating
    const [currentItem, setCurrentItem] = useState(0); // array to know current item (word)
    const [trigger, setTrigger] = useState(false); // switcher for refreshing work array from MainSection
    const [workMode, setWorkMode] = useState(null); // work mode: test or study
    const [wordsData, setWordsData] = useState([]); // main array from file
    const [settingsVisible, setSettingsVisible] = useState(false); // state to show/hide settings window
    // state for speak function on buttons prev/next in study mode and on answers correct wrong
    const [sound, setSound] = useState(
        localStorage.getItem('soundStatus') === null 
            ? true 
            : localStorage.getItem('soundStatus') === 'true');

    const [showApiExamples, setShowApiExamples] = useState(false); // state for examples from api
    const [googleSpread, setGoogleSpread] = useState( // state for switch to googleSpread
        localStorage.getItem("googleLink") !== null &&
        (localStorage.getItem("googleSpread") === null ? true :
            localStorage.getItem("googleSpread") === 'true'));
    const [loadingData, setLoadingData] = useState(false); // state for loading data, to show full-screen window

    // state for wrong words 
    const [wrongWords, setWrongWords] = useState(() => {
        return JSON.parse(localStorage.getItem("wrongWords") || "[]");
    });

    const [mistakeMode, setMistakeMode] = useState(false); // state to work with mistakes

    // defines system theme
    const getSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const [theme, setTheme] = useState(localStorage.getItem('themeColor') || getSystemTheme());

    const [googleLink, setGoogleLink] = useState(localStorage.getItem("googleLink"));


    // get data from csv file
    useEffect(() => {
        async function loadData() {
            try {
                setSelectedPart("all");
                setSelectedTheme("all");
                setCurrentItem(0);
                setLoadingData(true);

                const isGoogle = googleSpread && googleLink;
                try {
                    const data = isGoogle
                        ? await SpreadsheetParser(googleLink)
                        : await ReadFileCsv();

                    if (data.length > 0) {
                        setWordsData(data);
                    } else {
                        alert("Your google sheet is empty!");
                        setWordsData(await ReadFileCsv());
                        setGoogleSpread(false);
                        localStorage.setItem("googleSpread", false);
                    }
                } catch {
                    alert("Your google sheet has some problems! Check it!")
                    setWordsData(await ReadFileCsv());
                    setGoogleSpread(false);
                    localStorage.setItem("googleSpread", false);
                }
            } catch (error) {
                console.log("TOTAL PROBLEM! WITH FILE");
            } finally {
                setLoadingData(false);       
            }
        }
        loadData();

    }, [googleSpread]);

    function resetAll() {
        setTrigger(prev => !prev)
        setTestMode(null);
        setSelectedPart("all");
        setSelectedTheme("all");
        setUniqueParts([]);
        setCurrentItem(0);
        setWorkMode(null);
        setSettingsVisible(false);
        setMistakeMode(false);
    }

    // props for components
    const settings = useMemo(() => ({
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
        trigger,
        setWrongWords,
        wrongWords,
        mistakeMode
    }), [setWorkMode, wordsData, testMode, uniqueParts, selectedPart, selectedTheme, currentItem, sound, trigger, mistakeMode]);


    const [isLoaded, setIsLoaded] = useState(false);
    const handleComplete = useCallback(() => {
        setIsLoaded(true);
    }, []);
    

    return (
        <>
            <AnimatePresence mode="wait">
                {!isLoaded && (
                    <motion.div
                        key="preloader"
                        className="fixed z-101 w-screen h-screen inset-0 dark:bg-[var(--dark)] bg-[var(--light)]"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: "-100vh" }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                    >
                        <Preloader loadingData={loadingData} onComplete={handleComplete} />
                    </motion.div>
                )}
            </AnimatePresence>



            <AnimatePresence mode="wait">
            { loadingData &&
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                        className="fixed inset-0 flex items-center justify-center bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] text-5xl font-bold z-99"
                >
                    Loading...⏳
                </motion.div>                
            }
            </AnimatePresence>


            <AnimatePresence mode="wait">
                {settingsVisible && (
                    <SettingsWindow
                        key="settings" // Добавляем уникальный ключ для AnimatePresence
                        showApiExamples={showApiExamples}
                        setShowApiExamples={setShowApiExamples}
                        sound={sound}
                        setSound={setSound}
                        theme={theme}
                        setTheme={setTheme}
                        setSettingsVisible={setSettingsVisible}
                        resetAll={resetAll}
                        googleSpread={googleSpread}
                        setGoogleSpread={setGoogleSpread}
                        googleLink={googleLink}
                        setGoogleLink={setGoogleLink}
                        wrongWords={wrongWords}
                        setMistakeMode={setMistakeMode}
                        mistakeMode={mistakeMode}
                    />
                )}
            </AnimatePresence>

            <div className={`flex flex-col ${settingsVisible ? "h-[100dvh]" : "min-h-[100dvh]"}`}>
                
                <HeaderSection settingsVisible={settingsVisible} theme={theme} setTheme={setTheme} setSettingsVisible={setSettingsVisible} logoClick={() => resetAll()}>EnglishMan</HeaderSection>
                <main className="flex flex-col items-center justify-center grow container">
                    { !mistakeMode &&
                    <AnimatePresence mode="wait">
                        {!workMode && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, scale: 0.55 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--light)] text-[var(--dark)] text-center mb-5 transition-colors duration-700">
                                    Hello! Glad to welcome you to EnglishMan! <br className="hidden sm:block" />
                                    Start learning new words right now!
                                </h1>
                                <div className="mt-7 flex justify-center gap-5 flex-wrap">
                                    {["study", "test"].map((mode) => (
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
                            </motion.div>
                        )}

                        {workMode === "test" && (
                            <motion.div
                                key="test-section" 
                                initial={{ opacity: 0, x: 120 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -120 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full"
                            >
                                <MemoTestSection { ...settings } />
                            </motion.div>
                        )}

                        {workMode === "study" && (
                            <motion.div
                                key="study-section" 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full"
                            >
                                <StudySection { ...settings } />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    }
                    <AnimatePresence mode='wait'>
                        { mistakeMode && 
                            <div className="max-w-full sm:max-w-[650px] flex flex-col justify-center">
                                <p className='text-[var(--dark)] dark:text-[var(--light)] text-center text-3xl font-bold'>This is your mistake list</p>
                                <p className='mt-2 text-[var(--dark)] dark:text-[var(--light)] text-xl font-medium'>You have {wrongWords.length} weak words:</p>
                                <div className="mt-4 max-h-[400px] overflow-y-auto text-[var(--dark)] dark:text-[var(--light)] w-full border border-gray-300 dark:border-gray-600">
                                    <div className="w-full overflow-x-auto">
                                        <table className="w-full min-w-[500px] border-collapse border border-gray-300 dark:border-gray-600">
                                            <thead>
                                                <tr className="bg-gray-200 dark:bg-gray-700 text-sm sm:text-lg">
                                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">
                                                        №
                                                    </th>
                                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">
                                                        Word
                                                    </th>
                                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">
                                                        Translation
                                                    </th>
                                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">
                                                        Example
                                                    </th>
                                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">
                                                        Part of speech
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {wrongWords.map((el, ind) => (
                                                    <tr
                                                        key={ind}
                                                        className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900 text-sm sm:text-lg"
                                                    >
                                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                                                            {ind + 1 + ")"}
                                                        </td>
                                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 cursor-pointer hover:opacity-70">
                                                            {el.word}
                                                        </td>
                                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                                                            {el.translation}
                                                        </td>
                                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                                                            {el.example.split("+").join("; ")}
                                                        </td>
                                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                                                            {el.partOfSpeech}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setWorkMode("test")}
                                    className='mt-5 buttonStyle text-xl font-medium'>
                                    Start test
                                </button>
                            </div>

                        }
                    </AnimatePresence>
                </main>
                <footer className="grow-0 text-[var(--dark)] dark:text-[var(--light)] text-s p-5 w-full text-center font-semibold container">
                    Kyiv {new Date().getFullYear()}
                </footer>
            </div>

        </>
    )
};


