import React, { useState, useEffect, memo } from "react";
import HeaderSection from "./components/sections/HeaderSection";
import TestSection from './components/sections/TestSection';
import ModeButton from './components/ModeButton';
import ReadFileCsv from './utilities/readFileCsv';
import WorkComponent from './components/WorkComponent'

const MemoTestSection = memo(TestSection);

export default function App() {
    const [testMode, setTestMode] = useState(null); // sets test mode: manual or choice
    const [selectedPart, setSelectedPart] = useState("all"); // sets part of speech
    const [selectedTheme, setSelectedTheme] = useState("all"); // sets theme
    const [uniqueParts, setUniqueParts] = useState([]); // unique parts of speech array to prevent repeating
    const [currentItem, setCurrentItem] = useState(0); // array to know current item (word)
    const [trigger, setTrigger] = useState(false); // switcher for refreshing work array from MainSection
    const [workMode, setWorkMode] = useState(null); // work mode: test or study
    const [wordsData, setWordsData] = useState([]); // main array from file


    // get data from csv file
    useEffect(() => {
        async function loadData() {
            try {
                const data = await ReadFileCsv();
                setWordsData(data);
            } catch (error) {
                console.log("Failed to load data. Please try again later.");
            }
        }
        loadData();
    }, []);

    function resetAll() {
        setTrigger(prev => !prev)
        setTestMode(null);
        setSelectedPart("all");
        setSelectedTheme("all");
        setUniqueParts([]);
        setCurrentItem(0);
        setWorkMode(null);
    }

    // props for components
    const settings = {
        setWorkMode,
        wordsData,
        setUniqueParts,
        testMode,
        setTestMode,
        uniqueParts,
        selectedPart,
        selectedTheme,
        setSelectedPart,
        setSelectedTheme,
        currentItem,
        setCurrentItem,
        trigger
    }

    return (
        // <div className='flex flex-col min-h-screen' style={{minHeight:inputMode!== null ? "":windowHeight}}>
        <div className='flex flex-col min-h-[100dvh]'>
            <HeaderSection logoClick={() => resetAll()}>EnglishMan</HeaderSection>
            <main className='flex flex-col items-center justify-center grow'>
                {!workMode && <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--light)] text-[var(--dark)] text-center mb-5">
                        Hello! Glad to welcome you to EnglishMan! <br className=' hidden sm:block' />
                        Start learning new words right now!
                    </h1>
                    <div className="mt-7 flex justify-center gap-5 flex-wrap">
                        {["study", "test"].map(mode => (
                            <ModeButton
                                key={mode}
                                onClick={() => setWorkMode(mode)}
                                isActive={workMode === mode}
                            >
                                <span className="sm:hidden">{mode === "study" ? "Study 📚" : "Test ✍️"}</span>
                                <span className="hidden sm:inline">
                                    {mode === "study" ? "Study Mode 📚" : "Test Mode ✍️"}
                                </span>
                            </ModeButton>
                        ))}
                    </div>
                </div>}
                { workMode === "test" &&
                    <MemoTestSection {...settings} />
                }
                {workMode === "study" &&
                    <WorkComponent {...settings}/>
                }
            </main>
            <footer className="grow-0 text-[var(--dark)] dark:text-[var(--light)] text-s p-5 w-full text-center font-semibold">
                Kyiv {new Date().getFullYear()}
            </footer>
        </div>
    );
}
