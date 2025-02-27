import { useMemo, useEffect } from "react";

export default function StudySection({
    wordsData,
    setWorkMode,
    setUniqueParts,
    uniqueParts,
    selectedPart,
    selectedTheme,
    setSelectedPart,
    setSelectedTheme,
    currentItem,
    setCurrentItem,
    trigger
}) {

    // sets array of selected parts of speech
    const filteredWords = useMemo(() => {
        if (!wordsData.length) return [];
        return selectedPart === "all"
            ? wordsData
            : wordsData.filter(word => word.partOfSpeech === selectedPart);
    }, [selectedPart, wordsData]);

    // sets final work array of selected theme
    const workArray = useMemo(() => {
        if (!wordsData.length) return [];
        return selectedTheme === "all"
            // [...filteredWords] to prevent mutation of filteredWords!
            ? [...filteredWords].sort(() => 0.5 - Math.random())
            : [...filteredWords].sort(() => 0.5 - Math.random()).filter(word => word.theme === selectedTheme);
    }, [selectedTheme, filteredWords, trigger]); // trigger form App is a switcher value to recognize Logo is clicked or not

    // sets array of themes if filteredWords has changed
    const themeArray = useMemo(() => {
        if (!wordsData.length) return []; // Добавлена проверка
        return [...new Set(filteredWords.map(word => word.theme))].filter(theme => theme.trim() !== "")
    }, [filteredWords]);

    // function processes click on answer-button and/or manual input
    const handleSwitchButton = (nav) => {
        if (nav === "next") {
            setCurrentItem(cur => (cur + 1 >= workArray.length ? cur : cur += 1));
        } else setCurrentItem(cur => (cur - 1 <= 0 ? 0 : cur -= 1));
    }

    // pronunciation words 
    const speak = (word) => {
        // let kek = word.split(' ');
        // for (let k of kek) {
        //     const utterance = new SpeechSynthesisUtterance(k);
        //     utterance.lang = "en-US";
        //     speechSynthesis.speak(utterance);
        // }

        const apiKey = "563c07f863a04525bbf03651c9dff98b";
        const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(word)}`;

        const audio = new Audio(url);
        audio.play();
    };

    useEffect(() => {
        setUniqueParts([...new Set(wordsData.map(word => word.partOfSpeech))].filter(word => word.trim() !== ""));
    }, [])

    return (<>
        <section className='container'>
            <div className="max-w-170 mx-auto flex flex-col space-y-4 justify-center items-center">
                    <div className='mt-5 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7'>
                    
                        {uniqueParts.length > 1 && (
                            <>
                                <div className='flex gap-2 font-medium flex-wrap items-center'>
                                    <p>Choose part of speech:</p>
                                    <select
                                        className='flex-1 max-w-full min-w-20 truncate cursor-pointer bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-1 rounded-lg outline-none hover:opacity-70'
                                        value={selectedPart}
                                        onChange={(e) => {
                                            setSelectedPart(e.target.value);
                                            setSelectedTheme("all");
                                            setCurrentItem(0);
                                        }}
                                    >
                                        <option value="all">all</option>
                                        {uniqueParts.map((part, index) => (
                                            <option key={index} value={part}>{part}</option>
                                        ))}
                                    </select>
                                </div>
                                {themeArray.length > 1 && (
                                    <div className='mt-4 flex gap-2 flex-nowrap font-medium items-center'>
                                        <p>Choose theme:</p>
                                        <select
                                            className='flex-1 max-w-full min-w-10 truncate cursor-pointer bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-1 rounded-lg outline-none hover:opacity-70'
                                            value={selectedTheme}
                                            onChange={(e) => { setSelectedTheme(e.target.value); setCurrentItem(0); }}
                                        >
                                            <option value="all">all</option>
                                            {themeArray.map((theme, index) => (
                                                <option key={index} value={theme}>{theme}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {/* <p className='my-4'>Total count of words {workArray.length > 1 && selectedTheme !== "all" && `in theme "${selectedTheme}"`}: {workArray.length}</p> */}
                            </>
                        )}

                        <div className='mt-6 mb-2 flex flex-col gap-3'>
                        <p className='break-words'>Word: <span className='cursor-pointer p-2 rounded-lg dark:bg-[var(--light)] dark:text-[var(--dark)] text-2xl font-semibold' onClick={() => speak(workArray[currentItem].word)}>{workArray[currentItem].word}</span></p> 
                        <p className='break-words'>Translation: <span className='text-2xl font-semibold '>{workArray[currentItem].translation}</span></p> 
                        {wordsData[currentItem].example !== "" && <p className='break-words'>Example: <span className='text-2xl font-semibold '>{workArray[currentItem].example}</span></p>}
                        </div>
                        {/* <p onClick={() => speak(workArray[currentItem].word)}>{workArray[currentItem].word}</p> */}
                        <div className='flex justify-center items-center mt-4 gap-5'>
                        <button 
                            className="buttonStyle"
                            disabled={currentItem === 0}
                            onClick={() => handleSwitchButton("prev")}>prev</button>    
                            <p>{currentItem + 1}/{workArray.length}</p>
                            <button 
                                className='buttonStyle'
                                disabled={currentItem === workArray.length - 1}
                                onClick={() => handleSwitchButton("next")}>next</button>
                        </div>
                    {currentItem === workArray.length - 1 && <div className='mt-7 flex justify-center'>
                        <button 
                            className='buttonStyle'
                            onClick={() => {
                                setCurrentItem(0);
                                setWorkMode("test");
                            }}
                        >Start test</button>
                    </div>}
                    </div>
            </div>
        </section>
    </>
    )
}

