import { useWordFilter } from "./useWordFilter";
import { useState, useEffect } from 'react';

export default function StudySection({
    wordsData,
    setWorkMode,
    uniqueParts,
    selectedPart,
    selectedTheme,
    setSelectedPart,
    setSelectedTheme,
    setUniqueParts,
    currentItem,
    setCurrentItem,
    trigger,
}) {
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


    const [exampleSentences, setExampleSentences] = useState([]); // Состояние для примеров
    const [loadingSentences, setLoadingSentences] = useState(false);
    
    // Функция для получения примеров из API
    const fetchExampleSentences = async (word) => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) throw new Error("Failed to fetch examples");
            setLoadingSentences(true);
            const data = await response.json();
            const examples =
                data[0]?.meanings[0]?.definitions
                    .filter((def) => def.example)
                    .map((def) => def.example) || ["No examples found"];
            setExampleSentences(examples);
            setLoadingSentences(false);
        } catch (err) {
            setExampleSentences([]);
        }
    };
    

    // Запрос примеров при изменении текущего слова
    useEffect(() => {
        if (workArray[currentItem]?.word) {
            setExampleSentences([]); // Сбрасываем состояние перед новым запросом
            fetchExampleSentences(workArray[currentItem].word);
        }
    }, [workArray, currentItem]);

    // function processes click on next/prev button in study mode
    const handleSwitchButton = (nav) => {
        let current;
        if (nav === "next") {
            current = currentItem + 1 >= workArray.length ? currentItem : currentItem + 1;
        } else {
            current = currentItem - 1 <= 0 ? 0 : currentItem - 1
        }
        speak(workArray[current].word);
        setCurrentItem(current);
    };

    // function speak of word
    const speak = (word) => {
        const apiKey = "563c07f863a04525bbf03651c9dff98b";
        const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(word)}`;
        const audio = new Audio(url);
        audio.currentTime = 0;
        audio.play();
    };

    return (
        <section className="container">
            <div className="max-w-170 mx-auto flex flex-col space-y-4 justify-center items-center">
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
                    <div className="mt-6 mb-2 flex flex-col gap-3">
                        <p className="break-words">
                            Word:{" "}
                            <span
                                className="cursor-pointer p-2 rounded-lg bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] text-2xl font-semibold"
                                onClick={() => speak(workArray[currentItem].word)}
                            >
                                {workArray[currentItem].word}
                            </span>
                        </p>
                        <p className="break-words">
                            Translation: <span className="text-2xl font-semibold">{workArray[currentItem].translation}</span>
                        </p>
                        {workArray[currentItem].example !== "" && (
                            <p className="break-words">
                                Example: <span className="text-2xl font-semibold">
                                    {workArray[currentItem].example !== ""}
                                </span>
                            </p>
                        )}
                        {workArray[currentItem].example === "" && (
                            <>
                                {loadingSentences ? <div>Loading examples...</div> : (
                                    exampleSentences.length > 0 && <p className="break-words">
                                        Example: {exampleSentences.map((example, index) => <span onClick={() => speak(example)} key={index}>{example} </span>)}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex justify-center items-center mt-4 gap-5">
                        <button
                            className="buttonStyle"
                            disabled={currentItem === 0}
                            onClick={() => handleSwitchButton("prev")}
                        >
                            prev
                        </button>
                        <p>
                            {currentItem + 1}/{workArray.length}
                        </p>
                        <button
                            className="buttonStyle"
                            disabled={currentItem === workArray.length - 1}
                            onClick={() => handleSwitchButton("next")}
                        >
                            next
                        </button>
                    </div>
                    {currentItem === workArray.length - 1 && (
                        <div className="mt-7 flex justify-center">
                            <button
                                className="buttonStyle"
                                onClick={() => {
                                    setCurrentItem(0);
                                    setWorkMode("test");
                                }}
                            >
                                Start test
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}