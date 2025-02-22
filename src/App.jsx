import React, { useState, useMemo } from "react";
import Header from './components/Header';
import ModeButton from './components/ModeButton';
import setFullSizeMobile from './utilities/setFullSizeMobile';
import ReadFileCsv from './utilities/readFileCsv';

export default function App() {
    const [state, setState] = useState({
        inputMode: null,
        selectedPart: "all",
        uniqueParts: []
    });

    const wordsData = ReadFileCsv();

    const resetAll = () => setState(prev => ({
        ...prev, inputMode: null, selectedPart: "all"
    }));

    const windowHeight = setFullSizeMobile();

    function handleClickMode(mode) { // добавил аргумент mode
        const uniqueParts = [...new Set(wordsData.map(word => word.partOfSpeech))];

        setState(prev => ({ ...prev, inputMode: mode, wordsData, uniqueParts }));
    }

    const filteredWords = useMemo(() =>
        state.selectedPart === "all"
            ? wordsData
            : wordsData.filter(word => word.partOfSpeech === state.selectedPart),
        [state.selectedPart, wordsData]
    );

    return (
        <div className='flex flex-col min-h-screen' style={{ minHeight: windowHeight }}>
            <Header logoClick={resetAll}>EnglishMan</Header>
            <main className='flex flex-col items-center justify-center grow'>
                <section className='container'>
                    <div className="mx-auto p-6 flex flex-col space-y-4 justify-center items-center">
                        {!state.inputMode && (
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--light)] text-[var(--dark)] text-center mb-5">
                                    Hello! Glad to welcome you to EnglishMan! <br /> Start learning new words right now!
                                </h1>
                            </div>
                        )}
                        <div className="flex justify-center gap-5">
                            {["manual", "choice"].map(m => (
                                <ModeButton
                                    key={m}
                                    onClick={() => handleClickMode(m)} // передаём аргумент в функцию
                                    isActive={state.inputMode === m}
                                >
                                    {m === "manual" ? "Manual Type" : "Choice Mode"}
                                </ModeButton>
                            ))}
                        </div>
                        {state.inputMode && (
                            <div className='dark:text-[var(--light)] text-[var(--dark)]'>
                                <div className='flex gap-2 text-[30px] font-medium sm:text-xl flex-wrap items-center'>
                                    <p>Choose part of speech:</p>
                                    <select
                                        className='cursor-pointer bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-1 rounded-lg outline-none hover:opacity-70'
                                        value={state.selectedPart} // изменил defaultValue на value
                                        onChange={(e) => setState(prev => ({ ...prev, selectedPart: e.target.value }))}
                                    >
                                        <option value="all">all</option>
                                        {state.uniqueParts.map((part, index) => ( // исправил uniqueParts -> state.uniqueParts
                                            <option key={index} value={part}>{part}</option>
                                        ))}
                                    </select>
                                </div>
                                <p>Total count of words: {filteredWords.length}</p>
                                <input className='border py-3 px-5 rounded-lg border-[var(--dark)] dark:border-[var(--light)] outline-blue-300' type="text" />
                            </div>
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
