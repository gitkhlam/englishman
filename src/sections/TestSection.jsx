import ModeButton from "../components/WorkModeButton";
import { useState, useEffect, useCallback } from "react";
import { useWordFilter } from "../hooks/useWordFilter";
import ThemesDropdown from '../components/ThemesDropdown';
import TestManualMode from '../components/test/TestManualMode';
import TestChoiceMode from '../components/test/TestChoiceMode';

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
}) {
    const [input, setInput] = useState("");
    const [randomFourWords, setRandomFourWords] = useState([]); // array for four answer button
    const [visibleNotification, setVisibleNotification] = useState(false); // notification full-screen window visibility
    const [currentNotificationMessage, setCurrentNotificationMessage] = useState("");

    const { workArray, themeArray, handlePartChange, handleThemeChange } = useWordFilter({
        wordsData,
        selectedPart,
        selectedTheme,
        setSelectedPart,
        setSelectedTheme,
        setUniqueParts,
        trigger,
        setCurrentItem,
    });

    // processes click on one of mode buttons
    const handleClickMode = useCallback((mode) => {
        setTestMode(mode);
    }, [setTestMode]);

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
                setSelectedPart("all");
                setSelectedTheme("all");
                showResultWindow("welldone.mp3", 1500, "Well done! Congratulations!🏆");
            } else {
                showResultWindow(); // show full-screen size window with answer
            }
        } else {
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
        setTimeout(() => setVisibleNotification(false), time);
    };

    return (
        <section className='w-full'>
            <div className="max-w-170 mx-auto flex flex-col space-y-4 justify-center items-center">
                {!testMode && (
                    <p className="text-[var(--dark)] dark:text-[var(--light)] text-2xl font-medium text-center">
                        Choose test mode:
                    </p>
                )}
                <div className="flex justify-center gap-5 flex-wrap">
                    {["manual", "choice"].map((mode) => (
                        <ModeButton key={mode} onClick={() => handleClickMode(mode)} isActive={testMode === mode}>
                            <span className="sm:hidden">{mode === "manual" ? "Manual ⌨️" : "Choice ✅"}</span>
                            <span className="hidden sm:inline">
                                {mode === "manual" ? "Manual Type ⌨️" : "Choice Mode ✅"}
                            </span>
                        </ModeButton>
                    ))}
                </div>
                {testMode && (
                    <div className="mt-5 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7">
                        {uniqueParts.length > 1 && (
                            <div className='flex flex-col gap-3'>
                                <ThemesDropdown label="Choose part of speech:" value={selectedPart} options={uniqueParts} onChange={handlePartChange} />
                                {themeArray.length > 1 && <ThemesDropdown label="Choose theme:" value={selectedTheme} options={themeArray} onChange={handleThemeChange} />}
                            </div>
                        )}
                        <div className="mt-3 border-b pb-3">
                            <p className="w-full text-3xl font-semibold break-words">
                                {workArray[currentItem].translation}
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
                            />
                        )}
                    </div>
                )}
            </div>
            {visibleNotification && (
                <div className="z-50 px-10 flex items-center justify-center fixed inset-0 min-h-screen w-full bg-[var(--dark)] text-[var(--light)] text-4xl overflow-hidden">
                    {currentNotificationMessage}
                </div>
            )}
        </section>
    );
}


