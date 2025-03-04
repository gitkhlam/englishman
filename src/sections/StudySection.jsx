import { useWordFilter } from "../hooks/useWordFilter";
import { useState, useEffect } from 'react';
import ThemesDropdown from '../components/ThemesDropdown';
import StudyWordComponent from '../components/study/StudyWordComponent';
import StudySwitchButtons from '../components/study/StudySwitchButtons';

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
    showApiExamples, // from settings window
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
    const [loadingSentences, setLoadingSentences] = useState(false); // state for loading sentences

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
            showApiExamples && fetchExampleSentences(workArray[currentItem].word); // if enabled - fetch
        }
    }, [workArray, currentItem, showApiExamples]);
    
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
            <div className="max-w-170 mx-auto">
                <div className="flex flex-col gap-3 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7">
                    {uniqueParts.length > 1 && (
                        <div className='flex flex-col gap-3'>
                            <ThemesDropdown label="Choose part of speech:" value={selectedPart} options={uniqueParts} onChange={handlePartChange} />
                            {themeArray.length > 1 && <ThemesDropdown label="Choose theme:" value={selectedTheme} options={themeArray} onChange={handleThemeChange} />}
                        </div>
                    )}
                    <StudyWordComponent
                        word={workArray[currentItem].word}
                        translation={workArray[currentItem].translation}
                        defaultExampleArrayLength={workArray[currentItem].example.length}
                        speak={speak}
                        loadingSentences={loadingSentences}
                        showApiExamples={showApiExamples}
                        defaultExampleArray={workArray[currentItem].example.split("+")}
                        apiExampleArrayLength={exampleSentences.length}
                        apiExampleArray={exampleSentences.slice(0, 3)}
                    />
                    <StudySwitchButtons
                        currentItem={currentItem}
                        workArray={workArray}
                        speak={speak}
                        sound={sound} 
                        setSound={setSound}
                        setCurrentItem={setCurrentItem}
                        setWorkMode={setWorkMode}
                    />
                    
                </div>
            </div>
        </section>
    );
}
