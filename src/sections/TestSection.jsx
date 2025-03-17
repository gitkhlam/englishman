import ModeButton from "../components/WorkModeButton";
import { useState, useEffect, useCallback } from "react";
import { useWordFilter } from "../hooks/useWordFilter";
import ThemesDropdown from '../components/ThemesDropdown';
import TestManualMode from '../components/test/TestManualMode';
import TestChoiceMode from '../components/test/TestChoiceMode';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../langConfig.js";
import { getTranslation } from '../langConfig.js';



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
    resetAll,
    fastAnimation,
    setFastAnimation,
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
    const { t } = useTranslation();

    
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
        workArray.length === 1 && setTestMode("manual")
    }, [currentItem, workArray]);

    // function processes click on answer-button and/or manual input
    const processChoice = (word) => {
        if (testMode === "manual" && input === "") return;

        if (word.trim().toLowerCase() === workArray[currentItem].word.toLowerCase()) {
            setCurrentItem((cur) => (cur + 1 >= workArray.length ? 0 : cur + 1));
            setInput("");

            const storedWords = JSON.parse(localStorage.getItem("wrongWords")) || [];
            const updatedWords = storedWords.filter(wordObj => wordObj.word !== workArray[currentItem].word);
            localStorage.setItem("wrongWords", JSON.stringify(updatedWords));
            
            // if user have done all words of selected theme
            if (currentItem + 1 >= workArray.length) {
                // setSelectedPart("all");
                // setSelectedTheme("all");
                showResultWindow({src:"welldone.mp3", time:0, message:"result"});
            } else {
                showResultWindow({}); // show full-screen size window with correct answer
            }
        } else {
            setCurrentProgress(prev => {
                const filtered = prev.filter(obj => obj.word !== workArray[currentItem].word);
                return [...filtered, workArray[currentItem]];
            });
            
            showResultWindow({src:"wrong.mp3", message:`${t("wrong_answer")} ❌`});
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
    const showResultWindow = ({ src = "correct.mp3", time = 500, message = `${t("correct_answer")} ✅` }) => {
        setCurrentNotificationMessage(message);
        !fastAnimation && setVisibleNotification(true);
        message === "result" && setVisibleNotification(true);
        sound && playSound(import.meta.env.BASE_URL + src); // answer sound plays if sound enabled
        time !== 0 && setTimeout(() => setVisibleNotification(false), time);
    };
    
    return (
    <motion.section
        initial={{ opacity: 0, scale: 0.95, x: 200 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: "-50vw" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full"
    >
        <motion.div 
            key="testModeMainBlock"
            //initial={{ opacity: 0, height: "auto" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            layout
            className={`max-w-170 mx-auto flex flex-col ${testMode ? "space-y-3" : "space-y-4"} justify-center items-center`}>
            <p className={`${testMode ? "p-4" : ""} text-[var(--dark)] dark:text-[var(--light)] text-4xl font-semibold text-center`}>
                {mistakeTest ? t("mistake_test_mode") : t("test_mode2")}
            </p>

            {!testMode && (
                <p className="text-[var(--dark)] dark:text-[var(--light)] text-2xl font-medium text-center">
                    {t("choose_test_mode")}
                </p>
            )}

            <div className="flex w-full justify-center gap-5 flex-wrap sm:mt-2">
                {["manual", "choice"].map((mode) => (
                    <ModeButton
                        key={mode}
                        onClick={() => handleClickMode(mode)}
                        isActive={testMode === mode}
                    >
                        <motion.span
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            transition={{ duration: 10.3, ease: "easeInOut" }}
                            className="sm:hidden"
                        >
                            {mode === "manual" ?
                                (testMode ? "⌨️" : `${t("manual")} ⌨️`) :
                                (testMode ? "✅" : `${t("choice")} ✅`)}
                        </motion.span>

                        <span className="hidden sm:inline">
                            { mode === "manual" ? `${t("manual_mode")} ⌨️` : `${t("choice_mode")} ✅`}
                        </span>
                    </ModeButton>


                ))}

                <AnimatePresence mode="wait">
                    {testMode && (
                        <motion.div
                            key="testModeBlock"
                            initial={{ opacity: 0, y: -20, height: 0}}
                            animate={{ opacity: 1, y: 0, height: "auto"}}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            layout
                            className="mt-3 sm:mt-5 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 overflow-hidden"
                        >
                            <div className="flex flex-col gap-3 p-7">
                                {mistakeTest &&
                                    <p className='text-3xl font-bold border-b-2 w-fit'>{t("mistake_word_test")}</p>
                                }
                                {uniqueParts.length >= 1 && (
                                    <ThemesDropdown
                                        label={t("choose_part_of_speech")}
                                        value={selectedPart}
                                        options={uniqueParts}
                                        onChange={handlePartChange}
                                        className="h-12"
                                        isTheme={false}
                                    />
                                )}
                                {themeArray.length >= 1 && (
                                    <ThemesDropdown
                                        label={t("choose_theme")}
                                        value={selectedTheme}
                                        options={themeArray}
                                        onChange={handleThemeChange}
                                        className="h-12"
                                        isTheme={true}
                                    />
                                )}
                                    <div className="mt-3">
                                        <p className="w-full text-3xl font-semibold break-words">
                                            {workArray.length > 0 && getTranslation(workArray, currentItem) }
                                        </p>
                                    </div>

                                    {testMode === "manual" && (
                                        <TestManualMode
                                            input={input}
                                            setInput={setInput}
                                            processChoice={processChoice}
                                            currentItem={currentItem}
                                            workArray={workArray}
                                            setSound={setSound}
                                            sound={sound}
                                            setFastAnimation={setFastAnimation}
                                            fastAnimation={fastAnimation}
                                            playSound={playSound}
                                        />
                                    )}
                                    {testMode === "choice" && (
                                        <TestChoiceMode
                                            randomFourWords={randomFourWords}
                                            processChoice={processChoice}
                                            currentItem={currentItem}
                                            sound={sound}
                                            setSound={setSound}
                                            workArray={workArray}
                                            setFastAnimation={setFastAnimation}
                                            fastAnimation={fastAnimation}
                                            playSound={playSound}
                                        />
                                    )}
                            </div>

                            
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>

            <AnimatePresence mode='wait'>
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
                            <div className='flex flex-col gap-4'>

                                {mistakeTest && <span className='text-4xl font-bold pb-2 border-b-2'>{t("work_on_mistakes")}</span>}
                                <span className='font-bold text-4xl'>
                                    {(() => {
                                        const percentage = ((workArrayLength - currentProgress.length) * 100) / workArrayLength;

                                        if (percentage === 100) return t("result_1");
                                        if (percentage >= 90) return t("result_2");
                                        if (percentage >= 80) return t("result_3");;
                                        if (percentage >= 60) return t("result_4");
                                        if (percentage >= 50) return t("result_5");
                                        return t("result_6");
                                    })()}
                                </span>

                                <span className='text-3xl font-bold'>
                                    {t("your_score")} {` `}
                                    <span className='bg-[var(--light)] text-[var(--dark)] p-1 rounded-lg'>
                                        {`${Math.round((workArrayLength - currentProgress.length) * 100 / workArrayLength)}%.`}
                                    </span>
                                </span>
                                <span className='text-2xl'>
                                    {`${t("you_got")} ${workArrayLength - currentProgress.length} ${t("out_of")} ${workArrayLength} ${t("words_correct")}.`}
                                </span>
                            </div>
                            : <span className='text-4xl font-medium'>
                                {currentNotificationMessage}
                            </span>
                    }
                </Notifications>
            )}
            </AnimatePresence>

    </motion.section>

    );
}


function Notifications({ currentProgress, setWrongWords, isResult, setCurrentProgress, setSelectedPart, setSelectedTheme, setVisibleNotification, mistakeTest, resetAll, children}) {

    const { t } = useTranslation();
    
    const addWords = (newArray) => {
//[{"word":"move","translation":"двигать(ся)","example":"He moved toward us","partOfSpeech":"verb","theme":""},{"word":"run","translation":"бежать","example":"I love my mother","partOfSpeech":"","theme":""},{"word":"people","translation":"люди","example":"I love my mother","partOfSpeech":"","theme":""},{"word":"mother","translation":"мама","example":"I love my mother+and I love my father+ I should make them happy and proud","partOfSpeech":"","theme":""}]        
        
        setWrongWords(prevWords => {
            const storedWords = JSON.parse(localStorage.getItem("wrongWords") || "[]");
            const baseWords = mistakeTest ? storedWords : prevWords;

            // Фильтруем newArray, исключая уже сохранённые слова
            const filteredNewWords = newArray.filter(newWord =>
                !baseWords.some(word => word.word === newWord.word)
            );

            const updatedWords = [...baseWords, ...filteredNewWords];

            // Обновляем localStorage
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
        <motion.div
            initial={{ scale: 0.55 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1.45, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`z-50 px-2 flex items-center justify-center fixed inset-0 min-h-screen w-full text-[var(--dark)] dark:text-[var(--light)] overflow-hidden ${isResult ? "backdrop-blur-xl" : "bg-[var(--light)] dark:bg-[var(--dark)]"}`}
        >
        
        <div
            className="grow flex flex-col justify-center items-center container"
        >
        { children }
        { isResult &&
            <button 
                onClick={handleClick}
                className='mt-4 text-3xl font-medium bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] py-1 px-3 rounded-lg cursor-pointer hover:opacity-70'>
                {t("close")}
            </button>
        }
        </div>
    </motion.div>
    )
}

