import ModeButton from "../ModeButton";
import { useState, useEffect, useCallback } from "react";
import { useWordFilter } from "../useWordFilter";

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
            showResultWindow("wrong.mp3", 500, "Wrong answer! ❌");
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
        playSound(import.meta.env.BASE_URL + src);
        setTimeout(() => setVisibleNotification(false), time);
    };

    return (
        <section className="container">
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
                            <>
                                <div className="flex gap-2 font-medium flex-wrap items-center">
                                    <p>Choose part of speech:</p>
                                    <select
                                        className="flex-1 max-w-full min-w-20 truncate cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] p-1 rounded-lg outline-none hover:opacity-70"
                                        value={selectedPart}
                                        onChange={(e) => handlePartChange(e.target.value)}
                                    >
                                        <option value="all">all</option>
                                        {uniqueParts.map((part, index) => (
                                            <option key={index} value={part}>
                                                {part}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {themeArray.length > 1 && (
                                    <div className="mt-4 flex gap-2 flex-nowrap font-medium items-center">
                                        <p>Choose theme:</p>
                                        <select
                                            className="flex-1 max-w-full min-w-10 truncate cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] p-1 rounded-lg outline-none hover:opacity-70"
                                            value={selectedTheme}
                                            onChange={(e) => handleThemeChange(e.target.value)}
                                        >
                                            <option value="all">all</option>
                                            {themeArray.map((theme, index) => (
                                                <option key={index} value={theme}>
                                                    {theme}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="mt-6 mb-2">
                            <p className="w-full text-3xl font-semibold break-words">
                                {workArray[currentItem].translation}
                            </p>
                        </div>
                        {testMode === "manual" && (
                            <div>
                                <input
                                    className="my-4 w-full border py-3 px-5 rounded-lg border-[var(--dark)] dark:border-[var(--light)] outline-blue-300"
                                    type="text"
                                    value={input}
                                    placeholder="Type translation and press 'Enter'"
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && processChoice(input)}
                                />
                                <div className="flex items-center gap-5">
                                    <button className="buttonStyle" onClick={() => processChoice(input)}>
                                        Check
                                    </button>
                                    <p>
                                        {currentItem}/{workArray.length}
                                    </p>
                                </div>
                            </div>
                        )}
                        {testMode === "choice" && (
                            <>
                                <div className="mt-5 flex gap-4 flex-wrap justify-around sm:justify-start items-center">
                                    {randomFourWords.map((word, ind) => (
                                        <button
                                            key={ind}
                                            className="buttonStyle"
                                            onClick={() => processChoice(word.word)}
                                        >
                                            {word.word}
                                        </button>
                                    ))}
                                </div>
                                <p className="pt-4">
                                    {currentItem + 1}/{workArray.length}
                                </p>
                            </>
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