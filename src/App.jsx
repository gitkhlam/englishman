import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"; // Добавляем роутинг
import HeaderSection from "./sections/HeaderSection";
import TestSection from './sections/TestSection';
import ModeButton from './components/WorkModeButton';
import ReadFileCsv from './utilities/readFileCsv';
import StudySection from './sections/StudySection';
import SpreadsheetParser from './utilities/SpreadSheetParse';
import SettingsWindow from './sections/SettingsWindow';
import Preloader from './sections/Preloader';
import { AnimatePresence, motion } from "framer-motion";
import Loader from './components/Loader';
import MistakesSection from './sections/MistakesSection';
import { useTranslation } from "react-i18next";
import "./langConfig.js";
import GoogleSettings from './components/settings/GoogleSettings.jsx';
import MotionComponent from './components/MotionComponent.jsx';
import { playSound } from './Sound.js';


const MemoTestSection = memo(TestSection);
const MemoStudySection = memo(StudySection);


export const routeEnglishman = "/englishman";

// Главный компонент с маршрутами
function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

function AppContent() {

    const { t } = useTranslation(); // for language
    
    const location = useLocation(); // for route animation

    const navigate = useNavigate(); // for route navigation

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
    const [showApiMenu, setShowApiMenu] = useState(false);
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

    const [fastAnimation, setFastAnimation] = useState(false);


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
                    alert(t("empty_google_sheet"));
                    setWordsData(await ReadFileCsv());
                    setGoogleSpread(false);
                    localStorage.setItem("googleSpread", false);
                }
            } catch (error) {
                alert(t("gsh_some_problem"));
                setWordsData(await ReadFileCsv());
                setGoogleSpread(false);
                localStorage.setItem("googleSpread", false);
            } finally {
                setLoadingData(false);
            }
        }
        loadData();
    }, [googleSpread, googleLink]);

    const resetAll = useCallback(() => {
        setTimeout(() => {
            setTestMode(null);
            setTrigger(prev => !prev);
            setSelectedPart("all");
            setSelectedTheme("all");
            setUniqueParts([]);
            setCurrentItem(0);

        }, 100); // delay to prevent animation of disappearing element
        
        setSettingsVisible(false);
        setMistakeTest(false);
        navigate(`${routeEnglishman}/`);
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
        resetAll,
        fastAnimation,
        setFastAnimation,
        setMistakeTest,
        googleLink, 
        setGoogleLink,
        setLoadingData,
    }), [showApiExamples, googleLink, fastAnimation, wordsData, testMode, uniqueParts, selectedPart, selectedTheme, currentItem, sound, trigger, mistakeTest, resetAll, wrongWords]);

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
                <HeaderSection 
                    theme={theme} setTheme={setTheme} 
                    settingsVisible={settingsVisible}
                    setSettingsVisible={setSettingsVisible} 
                    logoClick={resetAll}
                >
                    EnglishMa<span onClick={(e) => { e.stopPropagation(); playSound("click.mp3"); setShowApiMenu(prev => !prev)}}>n</span>
                </HeaderSection>
                
                    <main className="flex flex-col items-center justify-center grow container">
                    
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path={routeEnglishman} element={<WelcomeScreen navigate={navigate} />} />
                            <Route path={`${routeEnglishman}/test`} element={<MemoTestSection {...settings} />} />
                            <Route path={`${routeEnglishman}/study`} element={<MemoStudySection {...settings} />} />
                            <Route path={`${routeEnglishman}/mistakes`} element={<MistakesSection {...settings}/>} />
                            <Route path={`${routeEnglishman}/custom`} element={<GoogleSettings {...settings} />} />
                            <Route path="*" element={<div>404 - {t("404")}</div>} />
                        </Routes>
                    </AnimatePresence>

                    </main>
                <footer className="relative p-5 text-center font-semibold"><span>Kyiv {new Date().getFullYear()}</span></footer>
            </div>
            <AnimatePresence mode="wait">
                {settingsVisible && <SettingsWindow showApiMenu={showApiMenu} sound={sound} setSound={setSound} theme={theme} setTheme={setTheme} setSettingsVisible={setSettingsVisible} resetAll={resetAll} googleSpread={googleSpread} setGoogleSpread={setGoogleSpread} googleLink={googleLink} setGoogleLink={setGoogleLink} wrongWords={wrongWords} setMistakeTest={setMistakeTest} setShowApiExamples={setShowApiExamples} showApiExamples={showApiExamples} />}
            </AnimatePresence>
        </>
    );
}


export default App;


function WelcomeScreen ({ navigate }){
    const { t } = useTranslation();

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className='max-w-[600px]'
        >
            <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-5 transition-colors duration-700">
                {t("hello_text")}
            </h1>
            <div className="mt-7 flex justify-center gap-5 flex-wrap">
                <ModeButton onClick={() => navigate(`${routeEnglishman}/study`)}>{t("study_mode")}</ModeButton>
                <ModeButton onClick={() => navigate(`${routeEnglishman}/test`)}>{t("test_mode")}</ModeButton>
            </div>
        </motion.section>
    );
}

