import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // Добавляем роутинг
import HeaderSection from "./sections/HeaderSection";
import TestSection from './sections/TestSection';
import ModeButton from './components/WorkModeButton';
import ReadFileCsv from './utilities/readFileCsv';
import StudySection from './sections/StudySection';
import SpreadsheetParser from './utilities/SpreadSheetParse';
import SettingsWindow from './sections/SettingsWindow';
import Preloader from './sections/Preloader';
import { motion, AnimatePresence } from "framer-motion";

const MemoTestSection = memo(TestSection);

// Главный компонент с маршрутами
function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

// Основная логика приложения
function AppContent() {
    const navigate = useNavigate(); // Для программной навигации

    const [testMode, setTestMode] = useState(null);
    const [selectedPart, setSelectedPart] = useState("all");
    const [selectedTheme, setSelectedTheme] = useState("all");
    const [uniqueParts, setUniqueParts] = useState([]);
    const [currentItem, setCurrentItem] = useState(0);
    const [trigger, setTrigger] = useState(false);
    const [workMode, setWorkMode] = useState(null);
    const [wordsData, setWordsData] = useState([]);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [sound, setSound] = useState(
        localStorage.getItem('soundStatus') === null
            ? true
            : localStorage.getItem('soundStatus') === 'true'
    );
    const [showApiExamples, setShowApiExamples] = useState(false);
    const [googleSpread, setGoogleSpread] = useState(
        localStorage.getItem("googleLink") !== null &&
        (localStorage.getItem("googleSpread") === null ? true :
            localStorage.getItem("googleSpread") === 'true')
    );
    const [loadingData, setLoadingData] = useState(false);
    const [wrongWords, setWrongWords] = useState(() => {
        return JSON.parse(localStorage.getItem("wrongWords") || "[]");
    });
    const [mistakeSection, setMistakeSection] = useState(false);
    const [mistakeTest, setMistakeTest] = useState(false);
    const [theme, setTheme] = useState(
        localStorage.getItem('themeColor') ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
    const [googleLink, setGoogleLink] = useState(localStorage.getItem("googleLink"));
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setSelectedPart("all");
                setSelectedTheme("all");
                setCurrentItem(0);
                setLoadingData(true);
                const isGoogle = googleSpread && googleLink;
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
            } catch (error) {
                alert("Your google sheet has some problems! Check it!");
                setWordsData(await ReadFileCsv());
                setGoogleSpread(false);
                localStorage.setItem("googleSpread", false);
            } finally {
                setLoadingData(false);
            }
        }
        loadData();
    }, [googleSpread]);

    const resetAll = useCallback(() => {
        setTrigger(prev => !prev);
        setTestMode(null);
        setSelectedPart("all");
        setSelectedTheme("all");
        setUniqueParts([]);
        setCurrentItem(0);
        setWorkMode(null);
        setSettingsVisible(false);
        setMistakeSection(false);
        setMistakeTest(false);
        navigate("/englishman/"); // Возвращаемся на главную
    }, []);

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
        mistakeTest,
        resetAll
    }), [setWorkMode, wordsData, testMode, uniqueParts, selectedPart, selectedTheme, currentItem, sound, trigger, mistakeTest, resetAll]);

    const handleComplete = useCallback(() => setIsLoaded(true), []);

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

            {loadingData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed inset-0 flex items-center justify-center bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] text-5xl font-bold z-99"
                >
                    <Loader fullText={"Loading...⏳"} />
                </motion.div>
            )}

            <div className={`flex flex-col ${settingsVisible ? "h-[100dvh]" : "min-h-[100dvh]"}`}>
                <HeaderSection
                    settingsVisible={settingsVisible}
                    theme={theme}
                    setTheme={setTheme}
                    setSettingsVisible={setSettingsVisible}
                    logoClick={resetAll}
                >
                    EnglishMan
                </HeaderSection>

                <main className="flex flex-col items-center justify-center grow container">
                    <Routes>
                        <Route
                            path="/englishman"
                            element={
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
                                        <ModeButton onClick={() => navigate("/englishman/study")}>Study Mode 📚</ModeButton>
                                        <ModeButton onClick={() => navigate("/englishman/test")}>Test Mode ✍️</ModeButton>
                                    </div>
                                </motion.div>
                            }
                        />
                        <Route
                            path="/englishman/test"
                            element={
                                <motion.div
                                    key="test-section"
                                    initial={{ opacity: 0, x: 120 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -120 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="w-full"
                                >
                                    <MemoTestSection {...settings} />
                                </motion.div>
                            }
                        />
                        <Route
                            path="/englishman/study"
                            element={
                                <motion.div
                                    key="study-section"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="w-full"
                                >
                                    <StudySection {...settings} />
                                </motion.div>
                            }
                        />
                        <Route
                            path="/englishman/mistakes"
                            element={<MistakesSection wrongWords={wrongWords} setMistakeTest={setMistakeTest} setMistakeSection={setMistakeSection} setTestMode={setTestMode} setCurrentItem={setCurrentItem} />}
                        />
                        <Route path="*" element={<div>404 - Page Not Found</div>} />
                    </Routes>
                </main>

                <footer className="grow-0 text-[var(--dark)] dark:text-[var(--light)] text-s p-5 w-full text-center font-semibold container">
                    Kyiv {new Date().getFullYear()}
                </footer>
            </div>

            <AnimatePresence mode="wait">
                {settingsVisible && (
                    <SettingsWindow
                        key="settings"
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
                        setMistakeSection={setMistakeSection}
                        setMistakeTest={setMistakeTest}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

// Компонент для страницы ошибок
function MistakesSection({ wrongWords, setMistakeTest, setMistakeSection, setTestMode, setCurrentItem }) {
    const navigate = useNavigate();
    return (
        <motion.div
            key="mistake-test-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -200 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full flex justify-center"
        >
            <div className="max-w-full sm:max-w-[650px] flex flex-col justify-center">
                <p className="text-[var(--dark)] dark:text-[var(--light)] text-center text-3xl font-bold">This is your mistake list</p>
                <p className="mt-2 text-[var(--dark)] dark:text-[var(--light)] text-xl font-medium">
                    You have {`${wrongWords.length} weak ${wrongWords.length > 1 ? "words" : "word"}`}
                </p>
                <div className="mt-4 max-h-[400px] overflow-y-auto text-[var(--dark)] dark:text-[var(--light)] w-full border border-gray-300 dark:border-gray-600">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[500px] border-collapse border border-gray-300 dark:border-gray-600">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-700 text-sm sm:text-lg">
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">№</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">Word</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">Translation</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">Example</th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">Part of speech</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wrongWords.map((el, ind) => (
                                    <tr key={ind} className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900 text-sm sm:text-lg">
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{ind + 1 + ")"}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 cursor-pointer hover:opacity-70">{el.word}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{el.translation}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{el.example.split("+").join("; ")}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{el.partOfSpeech}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setTestMode("choice");
                        setCurrentItem(0);
                        setMistakeSection(false);
                        setMistakeTest(true);
                        navigate("/englishman/test"); // Переход на тест
                    }}
                    className="mt-5 buttonStyle text-xl font-medium"
                >
                    Start test
                </button>
            </div>
        </motion.div>
    );
}

export default App;

function Loader({ fullText }) {
    const [text, setText] = useState("");
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0, index));
            index++;
            if (index > fullText.length) index = 0;
        }, 100);
        return () => clearInterval(interval);
    }, [fullText]);
    return (
        <div className="min-w-[320px] fixed inset-0 z-999 bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] flex flex-col items-center justify-center p-10">
            <div className="mb-4 text-3xl sm:text-4xl font-mono font-bold select-none">
                {text} <span className="animate-blink"> | </span>
            </div>
            <div className="w-[200px] h-[2px] bg-[var(--dark)] dark:bg-[var(--light)] rounded relative overflow-hidden">
                <div className="w-[40%] h-full bg-amber-50 dark:bg-gray-800 animate-loading-bar"></div>
            </div>
        </div>
    );
}