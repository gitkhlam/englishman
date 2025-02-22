import React, { useState, useMemo, useEffect, memo } from "react";
import Header from "./components/Header";
import ModeButton from "./components/ModeButton";
import setFullSizeMobile from "./utilities/setFullSizeMobile";
import ReadFileCsv from "./utilities/readFileCsv";

// Мемоизация компонентов
const MemoHeader = memo(Header);
const MemoModeButton = memo(ModeButton);

export default function App() {
    const [inputMode, setInputMode] = useState(null);
    const [selectedPart, setSelectedPart] = useState("all");
    const [selectedTheme, setSelectedTheme] = useState("all");
    const [uniqueParts, setUniqueParts] = useState([]);

    const wordsData = ReadFileCsv();
    const windowHeight = setFullSizeMobile();

    // Мемоизация функции
    const handleClickMode = useMemo(() => (mode) => {
        setInputMode(mode);
        setUniqueParts([...new Set(wordsData.map(word => word.partOfSpeech))]);
    }, [wordsData]);

    const filteredWords = useMemo(() => {
        return selectedPart === "all"
            ? wordsData
            : wordsData.filter(word => word.partOfSpeech === selectedPart);
    }, [selectedPart, wordsData]);

    const filteredWords2 = useMemo(() => {
        return selectedTheme === "all"
            ? filteredWords
            : filteredWords.filter(word => word.theme === selectedTheme);
    }, [selectedTheme, filteredWords]);

    const themeArray = useMemo(() =>
        [...new Set(filteredWords.map(word => word.theme))],
        [filteredWords]
    );

    // Вынести селекты в отдельный компонент
    const FilterControls = ({ parts, themes, onPartChange, onThemeChange }) => (
        <div className='dark:text-[var(--light)] text-[var(--dark)]'>
            <div className='flex gap-2 text-[30px] font-medium sm:text-xl flex-wrap items-center'>
                <p>Choose part of speech:</p>
                <select
                    className='cursor-pointer bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-1 rounded-lg outline-none hover:opacity-70'
                    value={selectedPart}
                    onChange={onPartChange}
                >
                    <option value="all">all</option>
                    {parts.map((part, index) => (
                        <option key={index} value={part}>{part}</option>
                    ))}
                </select>
            </div>
            {themes.length > 1 && (
                <div className='flex gap-2 text-[30px] font-medium sm:text-xl flex-wrap items-center'>
                    <p>Choose theme:</p>
                    <select
                        className='cursor-pointer bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-1 rounded-lg outline-none hover:opacity-70'
                        value={selectedTheme}
                        onChange={onThemeChange}
                    >
                        <option value="all">all</option>
                        {themes.map((theme, index) => (
                            <option key={index} value={theme}>{theme}</option>
                        ))}
                    </select>
                </div>
               
            )}
            <p>Total count of words {selectedTheme !== "all" && `in theme "${selectedTheme}"`}: {filteredWords2.length}</p>
            <input
                className='border py-3 px-5 rounded-lg border-[var(--dark)] dark:border-[var(--light)] outline-blue-300'
                type="text"
            />
        </div>
    );

    return (
        <div className='flex flex-col min-h-screen' style={{ minHeight: windowHeight }}>
            <MemoHeader logoClick={() => setInputMode(null)}>EnglishMan</MemoHeader>
            <main className='flex flex-col items-center justify-center grow'>
                <section className='container'>
                    <div className="mx-auto p-6 flex flex-col space-y-4 justify-center items-center">
                        {!inputMode && (
                            <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--light)] text-[var(--dark)] text-center mb-5">
                                Hello! Glad to welcome you to EnglishMan! <br />
                                Start learning new words right now!
                            </h1>
                        )}
                        <div className="flex justify-center gap-5">
                            {["manual", "choice"].map(mode => (
                                <MemoModeButton
                                    key={mode}
                                    onClick={() => handleClickMode(mode)}
                                    isActive={inputMode === mode}
                                >
                                    {mode === "manual" ? "Manual Type" : "Choice Mode"}
                                </MemoModeButton>
                            ))}
                        </div>
                        {inputMode && uniqueParts.length > 1 && (
                            <FilterControls
                                parts={uniqueParts}
                                themes={themeArray}
                                onPartChange={(e) => {
                                    setSelectedPart(e.target.value);
                                    setSelectedTheme("all");
                                }}
                                onThemeChange={(e) => setSelectedTheme(e.target.value)}
                            />
                        )}
                    </div>
                </section>
            </main>
            <footer className="grow-0 text-[var(--dark)] dark:text-[var(--light)] text-s p-5 w-full text-center font-semibold">
                Kyiv {new Date().getFullYear()}
            </footer>
        </div>
    );
}