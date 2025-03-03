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
    sound,
    setSound,
    showApiExamples,
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


    const [exampleSentences, setExampleSentences] = useState([]); // state for examples
    const [loadingSentences, setLoadingSentences] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    
    // fetching examples 
    const fetchExampleSentences = async (word) => {
        try {
            setLoadingSentences(true);
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) throw new Error("Failed to fetch examples");
            const data = await response.json();
            const examples =
                data[0]?.meanings[0]?.definitions
                    .filter((def) => def.example)
                    .map((def) => def.example) || [];
            setExampleSentences(examples);
        } catch (err) {
            console.error(err);
            setExampleSentences([]);
        } finally {
            setLoadingSentences(false);
        }
    };
    

    // fetch when currentItem or workArray have changed
    useEffect(() => {
        if (workArray[currentItem]?.word) {
            setExampleSentences([]);
            showApiExamples && fetchExampleSentences(workArray[currentItem].word); // if enabled fetch
        }
    }, [workArray, currentItem, showApiExamples]);

    // function processes click on next/prev button in study mode
    const handleSwitchButton = (nav) => {
        let current;
        if (nav === "next") {
            current = currentItem + 1 >= workArray.length ? currentItem : currentItem + 1;
        } else {
            current = currentItem - 1 <= 0 ? 0 : currentItem - 1
        }
        sound && speak(workArray[current].word); // if sound enable speak
        setCurrentItem(current);
    };
 
    // function speak of word
    const speak = (word) => {
        
        window.speechSynthesis.cancel(); // if prev speech doesn't stop

        if (!word) return;

        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';

        utterance.voice = window.speechSynthesis.getVoices().find(voice => (voice.name === "Samantha" || voice.name.includes("Google")) && voice.lang === "en-US");

        // speak
        window.speechSynthesis.speak(utterance);
    };
    

    return (
        <section className='w-full'>
            <div className="max-w-170 mx-auto flex flex-col space-y-4 justify-center items-center">
                <div className="w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7">
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
                        {loadingSentences ? <div>Loading examples... ⏳</div> :
                            <div>
                            { !showApiExamples && workArray[currentItem].example.length >= 1 &&
                                <ExamplesComponent 
                                    setAccordionOpen={setAccordionOpen} 
                                    exampleArray={workArray[currentItem].example.split("+")} 
                                    accordionOpen={accordionOpen}
                                    speak={speak} 
                                />
                            }

                            { exampleSentences.length > 0 && 
                                <>
                                    <p>API example</p>
                                    <ExamplesComponent
                                        accordionOpen={accordionOpen}
                                        setAccordionOpen={setAccordionOpen}
                                        exampleArray={exampleSentences.slice(0, 3)}
                                        speak={speak}
                                    />
                                </>
                            }
                        </div>
                        }     
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
                    <div className='mt-3 w-full flex justify-center'>
                        <span 
                            className='cursor-pointer hover:opacity-70'
                            onClick={() => { setSound(prev => !prev) }}
                        >
                            {sound ? "🔊" : "🔇"}
                        </span>
                    </div>

                    {currentItem === workArray.length - 1 && (
                        <div className="mt-4 flex justify-center">
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


function ExamplesComponent({ setAccordionOpen, exampleArray, accordionOpen, speak }) {
    return (
        <div className="break-words mt-4 transition-all duration-300 ease-in-out">
            <button
                className="cursor-pointer bg-[var(--dark)] dark:bg-[var(--light)] text-[var(--light)] dark:text-[var(--dark)] font-medium p-2 rounded-lg"
                onClick={() => setAccordionOpen(prev => !prev)}
            >
                {exampleArray.length > 1 ? "Examples.. 👈" : "Example 👈"}
            </button>

            <ul
                className={`transition-all duration-300 ease-in-out ${accordionOpen ? "mt-3 opacity-100 max-h-full" : "opacity-0 max-h-0 overflow-hidden"}`}
            >
                {exampleArray.map((example, index) => (
                    <li
                        className="cursor-pointer text-2xl font-semibold"
                        onClick={() => speak(example)}
                        key={index}
                    >
                        {index + 1 + ") " + example}
                    </li>
                ))}
            </ul>
        </div>
    )
}