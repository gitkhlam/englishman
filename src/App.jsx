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
import { AnimatePresence } from "framer-motion";
import Loader from './components/Loader';
import MistakesSection from './sections/MistakesSection';
import { useTranslation } from "react-i18next";
import "./langConfig.js";
import GoogleSettings from './components/settings/GoogleSettings.jsx';
import MotionComponent from './components/MotionComponent.jsx';

const MemoTestSection = memo(TestSection);
const MemoStudySection = memo(StudySection);

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

    const { t } = useTranslation();

    const navigate = useNavigate(); // Для программной навигации

    const [testMode, setTestMode] = useState(null);
    const [selectedPart, setSelectedPart] = useState("all");
    const [selectedTheme, setSelectedTheme] = useState("all");
    const [uniqueParts, setUniqueParts] = useState([]);
    const [currentItem, setCurrentItem] = useState(0);
    const [trigger, setTrigger] = useState(false);
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
        setSettingsVisible(false);
        setMistakeTest(false);
        navigate("/englishman/"); // Возвращаемся на главную
    }, []);

    const settings = useMemo(() => ({
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
        setShowApiExamples,
        trigger,
        setWrongWords,
        wrongWords,
        mistakeTest,
        resetAll
    }), [wordsData, testMode, uniqueParts, selectedPart, selectedTheme, currentItem, sound, trigger, mistakeTest, resetAll]);

    const handleComplete = useCallback(() => setIsLoaded(true), []);

    return (
        <>
            <AnimatePresence mode="wait">
                {!isLoaded && (
                <MotionComponent
                    motionKey="preloader"
                    opacity1={1}
                    opacity2={1}
                    opacity3={0}
                    duration={0.7}
                    y3={"-100vh"}
                    animation="easeInOut"
                    style="fixed z-101 w-screen h-screen inset-0 dark:bg-[var(--dark)] bg-[var(--light)]"
                >
                    <Preloader loadingData={loadingData} onComplete={handleComplete} />
                </MotionComponent>
                )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
                {loadingData && <MotionComponent motionKey="loader-data" style="fixed inset-0 flex items-center justify-center z-99" opacity3={0} y3={"100vh"} y1={0} y2={0}><Loader fullText="Loading...⏳" /></MotionComponent>}
            </AnimatePresence>
            <div className={`flex flex-col dark:text-[var(--light)] text-[var(--dark)] ${settingsVisible ? "h-[100dvh]" : "min-h-[100dvh]"}`}>
                {!settingsVisible && <HeaderSection theme={theme} setTheme={setTheme} setSettingsVisible={setSettingsVisible} logoClick={resetAll}>EnglishMan</HeaderSection> }
                
                    <main className="flex flex-col items-center justify-center grow container">
                        <Routes>
                            <Route path="/englishman" element={<WelcomeScreen navigate={navigate} />} />
                            <Route path="/englishman/test" element={<MemoTestSection {...settings} />} />
                            <Route path="/englishman/study" element={<MemoStudySection {...settings} />} />
                            <Route path="/englishman/mistakes" element={<MistakesSection wrongWords={wrongWords} setMistakeTest={setMistakeTest} setTestMode={setTestMode} setCurrentItem={setCurrentItem} />} />
                            <Route path="/englishman/custom" element={<GoogleSettings googleLink={googleLink} setGoogleLink={setGoogleLink} setLoadingData={setLoadingData} />} />

                            <Route path="*" element={<div>404 - { t("404")}</div>} />
                        </Routes>
                    </main>
                <footer className="p-5 text-center font-semibold">Kyiv {new Date().getFullYear()}</footer>
            </div>
            <AnimatePresence mode="wait">
                {settingsVisible && <SettingsWindow sound={sound} setSound={setSound} theme={theme} setTheme={setTheme} setSettingsVisible={setSettingsVisible} resetAll={resetAll} googleSpread={googleSpread} setGoogleSpread={setGoogleSpread} googleLink={googleLink} setGoogleLink={setGoogleLink} wrongWords={wrongWords} setMistakeTest={setMistakeTest} setShowApiExamples={setShowApiExamples} showApiExamples={showApiExamples} />}
            </AnimatePresence>
        </>
    );
}


export default App;


function WelcomeScreen ({ navigate }){
    const { t } = useTranslation();
    return (
        <MotionComponent
            motionKey="welcome-screen"
            scale1={0.55}
            scale2={1}
            scale3={0.95}
            duration={0.7}
            animation="easeInOut"   
            style='max-w-[600px]'
        >
            <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-5 transition-colors duration-700">
                {t("hello_text")}
            </h1>
            <div className="mt-7 flex justify-center gap-5 flex-wrap">
                <ModeButton onClick={() => navigate("/englishman/study")}>{ t("study_mode")}</ModeButton>
                <ModeButton onClick={() => navigate("/englishman/test")}>{ t("test_mode")}</ModeButton>
            </div>
        </MotionComponent>
    );
}