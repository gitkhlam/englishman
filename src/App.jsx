import React, { useState, useEffect, memo } from "react";
import Header from "./components/Header";
import setFullSizeMobile from "./utilities/setFullSizeMobile";
import ReadFileCsv from "./utilities/readFileCsv";
import MainSection from './components/SectionMenu';

// Мемоизация компонентов
const MemoHeader = memo(Header);


export default function App() {
    const [inputMode, setInputMode] = useState(null);
    const [selectedPart, setSelectedPart] = useState("all");
    const [selectedTheme, setSelectedTheme] = useState("all");
    const [uniqueParts, setUniqueParts] = useState([]); // unique parts of speech array
    const [wordsData, setWordsData] = useState(null); // Состояние для данных
    const [currentItem, setCurrentItem] = useState(0);
    const [trigger, setTrigger] = useState(false);
    const windowHeight = setFullSizeMobile();
    
    useEffect(() => {
        async function loadData() {
            try {
                const data = await ReadFileCsv(); // Предполагаем, что это промис
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
        //setWordsData(curData => curData.sort(() => 0.5 - Math.random()));
    }

    return (
        // <div className='flex flex-col min-h-screen' style={{ minHeight: windowHeight }}>
        <div className='flex flex-col min-h-screen'>
            <MemoHeader logoClick={() => resetAll()}>EnglishMan</MemoHeader>
            <main className='flex flex-col items-center justify-center grow'>
                <MainSection
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