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
        setInputMode(null);
        setSelectedPart("all");
        setSelectedTheme("all");
        setUniqueParts([]);

    }

    return (
        <div className='flex flex-col min-h-screen' style={{ minHeight: windowHeight }}>
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
                />
            </main>
            <footer className="grow-0 text-[var(--dark)] dark:text-[var(--light)] text-s p-5 w-full text-center font-semibold">
                Kyiv {new Date().getFullYear()}
            </footer>
        </div>
    );
}