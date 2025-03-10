import ModeButton from "../components/WorkModeButton";
import { useState, useEffect, useCallback } from "react";
import { useWordFilter } from "../hooks/useWordFilter";
import ThemesDropdown from '../components/ThemesDropdown';
import TestManualMode from '../components/test/TestManualMode';
import TestChoiceMode from '../components/test/TestChoiceMode';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../langConfig.js";


export default function TestSection({
    wordsData,
    setTestMode,
    setUniqueParts,
    testMode,
    uniqueParts,
    selectedPart,
    selectedTheme,
    setSelectedPart,
    setSelectedTheme,
    currentItem,
    setCurrentItem,
    sound,
    setSound,
    trigger,
    setWrongWords,
    wrongWords,
    mistakeTest,
    resetAll
}) {
    const [input, setInput] = useState("");
    const [randomFourWords, setRandomFourWords] = useState([]); // array for four answer button
    const [visibleNotification, setVisibleNotification] = useState(false); // notification full-screen window visibility
    const [currentNotificationMessage, setCurrentNotificationMessage] = useState("");
    const [currentProgress, setCurrentProgress] = useState([]);

    const { workArray, themeArray, handlePartChange, handleThemeChange } = useWordFilter({
        wordsData: mistakeTest ? wrongWords : wordsData,
        selectedPart,
        selectedTheme,
        setSelectedPart,
        setSelectedTheme,
        setUniqueParts,
        trigger,
        setCurrentItem,
    });

    const workArrayLength = workArray.length;
    
    // processes click on one of mode buttons
    const handleClickMode = useCallback((mode) => {
        setTestMode(mode);
    }, [setTestMode]);

    useEffect(() => {
        setCurrentProgress([]);
    }, [workArray]);

    // refreshes RandomFourWords if currentItem or workArray have changed
    useEffect(() => {
        getRandomWords();
    }, [currentItem, workArray]);

    // function processes click on answer-button and/or manual input
    const processChoice = (word) => {
        if (testMode === "manual" && input === "") return;

        if (word.trim().toLowerCase() === workArray[currentItem].word.toLowerCase()) {
            setCurrentItem((cur) => (cur + 1 >= workArray.length ? 0 : cur + 1));
            setInput("");
            // if user have done all words of selected theme
            if (currentItem + 1 >= workArray.length) {
                // setSelectedPart("all");
                // setSelectedTheme("all");
                showResultWindow("welldone.mp3", 0, "result");
            } else {
                showResultWindow(); // show full-screen size window with correct answer
            }
        } else {
            setCurrentProgress(prev => {
                const filtered = prev.filter(obj => obj.word !== workArray[currentItem].word);
                return [...filtered, workArray[currentItem]];
            });
            
            showResultWindow("wrong.mp3", 500, "Wrong! ❌");
        }
    };

    // function set RandomFourWords array
    const getRandomWords = () => {
        if (workArray.length <= 4) {
            setRandomFourWords(workArray);
            return;
        }
        const filteredArray = workArray.filter((_, index) => index !== currentItem);
        const shuffled = filteredArray.sort(() => 0.5 - Math.random()).slice(0, 3);
        shuffled.push(workArray[currentItem]);
        setRandomFourWords(shuffled.sort(() => 0.5 - Math.random()));
    };

    // play sound function
    const playSound = (src) => {
        const audio = new Audio(src);
        audio.currentTime = 0;
        audio.play();
    };

    // function shows full-sized window with result of answer
    const showResultWindow = (src = "correct.mp3", time = 500, message = "Correct ✅") => {
        setCurrentNotificationMessage(message);
        setVisibleNotification(true);
        sound && playSound(import.meta.env.BASE_URL + src); // answer sound plays if sound enabled
        time !== 0 && setTimeout(() => setVisibleNotification(false), time);
    };

    const { t } = useTranslation();
    
    return (
        <section className="w-full">
            <div className={`max-w-170 mx-auto flex flex-col ${testMode ? "space-y-3" : "space-y-4"} justify-center items-center`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key="test-section-header" 
                        initial={{ opacity: 0, x: 20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 20, y: 10 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <p className={`${testMode ? "p-4" : ""} text-[var(--dark)] dark:text-[var(--light)] text-4xl font-semibold text-center`}>
                            {mistakeTest ? t("mistake_test_mode") : t("test_mode2") }
                            
                        </p>
                        { !testMode && (
                            <p className="text-[var(--dark)] dark:text-[var(--light)] text-2xl font-medium text-center">
                                { t("choose_test_mode") }
                            </p>
                        ) }
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`test-mode-${testMode ? "on" : "off"}`} 
                        initial={{ opacity: 0, x: testMode ? 0 : 220, y: testMode ? 150 : 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex justify-center gap-5 flex-wrap sm:mt-2"
                    >
                        {["manual", "choice"].map((mode) => (
                            <ModeButton
                                key={mode} 
                                onClick={() => handleClickMode(mode)}
                                isActive={testMode === mode}
                            >
                                {testMode ? (
                                    <span className="sm:hidden">{mode === "manual" ? "⌨️" : "✅"}</span>
                                ) : (
                                    <span className="sm:hidden">{mode === "manual" ? `${t("manual")} ⌨️` : `${t("choice")} ✅`}</span>
                                )}
                                <span className="hidden sm:inline">
                                    {mode === "manual" ? `${t("manual_mode")} ⌨️` : `${t("choice_mode")} ✅`}
                                </span>
                            </ModeButton>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    { testMode && (
                        <motion.div
                            layout
                            key="test-content" 
                            initial={{ opacity: 0, x: 0, y: 0 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: 0, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="mt-3 sm:mt-5 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7 transition-colors duration-700 overflow-hidden"
                        >
                            <div className="flex flex-col gap-3">
                                {mistakeTest &&
                                    <p className='text-3xl font-bold border-b-2 w-fit'>{t("mistake_word_test")}</p>
                                }
                                {/* { !mistakeMode &&  */}
                                    <>
                                    {uniqueParts.length >= 1 && (
                                        <ThemesDropdown
                                            label={t("choose_part_of_speech")}
                                            value={selectedPart}
                                            options={uniqueParts}
                                            onChange={handlePartChange}
                                            className="h-12"
                                        />
                                    )}
                                    {themeArray.length >= 1 && (
                                        <ThemesDropdown
                                            label={t("choose_theme")}
                                            value={selectedTheme}
                                            options={themeArray}
                                            onChange={handleThemeChange}
                                            className="h-12"
                                        />
                                    )}
                                    </>
                                {/* } */}
                                
                            </div>

                            <div className="mt-3">
                                <p className="w-full text-3xl font-semibold break-words">
                                    {workArray[currentItem].translation}
                                </p>
                            </div>
                            <AnimatePresence mode="wait">
                                {testMode === "manual" && (
                                    <motion.div
                                        layout
                                        key="test-manual" 
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <TestManualMode
                                            input={input}
                                            setInput={setInput}
                                            processChoice={processChoice}
                                            currentItem={currentItem}
                                            workArray={workArray}
                                            setSound={setSound}
                                            sound={sound}
                                        />
                                    </motion.div>
                                )}
                                { testMode === "choice" && (
                                    <motion.div
                                        layout
                                        key={`test-choice-${currentItem}`} 
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <TestChoiceMode
                                            randomFourWords={randomFourWords}
                                            processChoice={processChoice}
                                            currentItem={currentItem}
                                            sound={sound}
                                            setSound={setSound}
                                            workArray={workArray}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

            <AnimatePresence>   
                {visibleNotification && (
                    <Notifications 
                        setSelectedPart={setSelectedPart}
                        setSelectedTheme={setSelectedTheme}
                        setCurrentProgress={setCurrentProgress}
                        setVisibleNotification={setVisibleNotification}
                        setWrongWords={setWrongWords}
                        currentProgress={currentProgress}
                        mistakeTest={mistakeTest}
                        resetAll={resetAll}
                        isResult={currentNotificationMessage === "result"}>
                        { 
                            currentNotificationMessage === "result" 
                            ?  
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className='flex flex-col gap-4'>                                    
                                
                                { mistakeTest && <span className='text-4xl font-bold pb-2 border-b-2'>Work on mistakes</span>}
                                <span className='font-bold text-4xl'>
                                    {(() => {
                                        const percentage = ((workArrayLength - currentProgress.length) * 100) / workArrayLength;

                                        if (percentage === 100) return "Excellent! Congratulations! 🏆";
                                        if (percentage >= 80) return "Well done! Keep going! 📑";
                                            if (percentage >= 50) return "Not great ☹️, but you're getting there! Keep pushing!";
                                        return "That's really bad! 🙅‍♂️ You need to push harder!";
                                    })()}
                                </span>

                                <span className='text-3xl font-bold'>
                                    Your score is {` `} 
                                    <span className='bg-[var(--light)] text-[var(--dark)] p-1 rounded-lg'>
                                            {`${Math.round((workArrayLength - currentProgress.length) * 100 / workArrayLength)}%.`}
                                    </span>
                                </span> 
                                <span className='text-2xl'>
                                    {`You got ${workArrayLength - currentProgress.length} out of ${workArrayLength} words correct.`}
                                </span>
                            </motion.div>
                            : <motion.span 
                                key="result-wrong-right"
                                initial={{ opacity: 0.1 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className='text-4xl font-medium'>
                                { currentNotificationMessage }
                            </motion.span>
                        }
                    </Notifications>
                )}
                </AnimatePresence>
            </div>
        </section>
    );
}


function Notifications({ currentProgress, setWrongWords, isResult, setCurrentProgress, setSelectedPart, setSelectedTheme, setVisibleNotification, mistakeTest, resetAll, children}) {
    
    const addWords = (newArray) => {
        setWrongWords(prevWords => {
            const updatedWords = mistakeTest ? newArray : [
                ...prevWords,
                ...newArray.filter(newWord =>
                    !prevWords.some(prevWord => prevWord.word === newWord.word)
                )
            ];

            localStorage.setItem("wrongWords", JSON.stringify(updatedWords));

            return updatedWords;
        });
    };

    
    const handleClick = (e) => {
        if (e.target === e.currentTarget) {
            addWords(currentProgress);
            resetAll();
            setCurrentProgress([]);
            setVisibleNotification(false);    
        }
    };

    useEffect(() => {
        
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return(
        <div
            className={`z-50 px-2 flex items-center justify-center fixed inset-0 min-h-screen w-full text-[var(--dark)] dark:text-[var(--light)] overflow-hidden ${isResult ? "backdrop-blur-xl":"bg-[var(--light)] dark:bg-[var(--dark)]"}`}
        >
        
        <div
            className="grow flex flex-col justify-center items-center container"
        >
        { children }
        { isResult &&
            <button 
                onClick={handleClick}
                className='mt-4 text-3xl font-medium bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] py-1 px-3 rounded-lg cursor-pointer hover:opacity-70'>
                Close
            </button>
        }
        </div>
    </div>
    )
}

