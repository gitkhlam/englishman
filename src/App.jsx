import React, { useState, useEffect, memo, useMemo } from "react";
import Header from "./components/Header";
import setFullSizeMobile from "./utilities/setFullSizeMobile";
import ReadFileCsv from "./utilities/readFileCsv";
import MainSection from './components/SectionMenu';

const MemoMainSection = memo(MainSection);

export default function App() {
    const [inputMode, setInputMode] = useState(null); // sets input mode: manual or choice
    const [selectedPart, setSelectedPart] = useState("all"); // sets part of speech
    const [selectedTheme, setSelectedTheme] = useState("all"); // sets theme
    const [uniqueParts, setUniqueParts] = useState([]); // unique parts of speech array to prevent repeating
    const [wordsData, setWordsData] = useState(null); // main array from file
    const [currentItem, setCurrentItem] = useState(0); // array to know current item (word)
    const [trigger, setTrigger] = useState(false); // switcher for refreshing work array from MainSection
    
    const windowHeight = setFullSizeMobile();
    
    // get data from csv file
    useEffect(() => {
        async function loadData() {
            try {
                const data = await ReadFileCsv(); 
                setWordsData(data);
            } catch (error) {
                console.error("Error loading CSV:", error);
            }
        }
        loadData();
    }, []);

    if (!wordsData) {
        return <div>Loading...</div>;
    }

    function resetAll() {
        setTrigger(prev => !prev)
        setInputMode(null);
        setSelectedPart("all");
        setSelectedTheme("all");
        setUniqueParts([]);
        setCurrentItem(0);
    }

    return (
        <div className='flex flex-col min-h-screen' style={{minHeight:inputMode!== null ? "":windowHeight}}>
            <Header logoClick={() => resetAll()}>EnglishMan</Header>
            <main className='flex flex-col items-center justify-center grow'>
                <MemoMainSection
                    setInputMode={setInputMode}
                    setUniqueParts={setUniqueParts}
                    wordsData={wordsData}
                    inputMode={inputMode}
                    uniqueParts={uniqueParts}
                    selectedPart={selectedPart}
                    selectedTheme={selectedTheme}
                    setSelectedPart={setSelectedPart}
                    setSelectedTheme={setSelectedTheme}
                    currentItem={currentItem}
                    setCurrentItem={setCurrentItem}
                    trigger={trigger}
                />
            </main>
            <footer className="grow-0 text-[var(--dark)] dark:text-[var(--light)] text-s p-5 w-full text-center font-semibold">
                Kyiv {new Date().getFullYear()}
            </footer>
        </div>
    );
}