import { useWordFilter } from "../hooks/useWordFilter";
import ThemesDropdown from '../components/ThemesDropdown';
import StudyWordComponent from '../components/study/StudyWordComponent';
import StudySwitchButtons from '../components/study/StudySwitchButtons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../langConfig.js";
import { useState, useCallback, useEffect } from 'react';
import ModeButton from '../components/WorkModeButton.jsx';
import { Flashcard } from '../components/study/FlashCard.jsx';
import { getTranslation } from '../langConfig.js';
import { PlayIcon } from "@heroicons/react/24/solid";
import { speak } from '../Sound.js';


export default function StudySection({
    wordsData,
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

    const { t } = useTranslation();
    
    // const PIXABAY_API_KEY = "49300347-bb4d366c7fd6741a3e9a7532c";
    // const [query, setQuery] = useState("");
    // const [imageUrl, setImageUrl] = useState(null);
    // const [showPictures, setShowPictures] = useState(false);


    // useEffect(() => {
    //     workArray.length && setQuery(workArray[currentItem].word);
    //     fetchImage();
    // }, [currentItem, workArray, query])

    // async function fetchImage() {
    //     console.log(query);
    //     if (!query) return;
    //     const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&page=1`;

    //     try {
    //         const response = await fetch(url);
    //         const data = await response.json();

    //         if (data.hits.length > 0) {
    //             setImageUrl(data.hits[0].webformatURL);
    //         } else {
    //             console.log("no images!!");
    //             //alert("No images found");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching image:", error);
    //     }
    // }
    
    // const [checked, setChecked] = useState(false);

    const [studyMode, setStudyMode] = useState("def");


    const handleClickMode = useCallback((mode) => {
            setStudyMode(mode);
        }, [setStudyMode]);

    return (
        <motion.section 
            initial= {{ opacity: 0, x: -400, scale: 0.55 }}
            animate = {{ opacity: 1, x: 0, scale: 1 }}
            exit = {{ opacity: 0, x: 400, scale: 0.80 }}
            transition = {{ duration: 0.5, ease: "easeInOut" }}
            className="w-full">
            <div
                className="max-w-170 mx-auto">
                <p className='p-4 text-[var(--dark)] dark:text-[var(--light)] text-4xl font-semibold text-center'>
                    { t("study_mode") }
                </p>
                <div className='flex justify-center gap-5'>
                    {["card", "def", "list"].map((mode) => (
                        <ModeButton
                            key={mode}
                            onClick={() => handleClickMode(mode)}
                            isActive={studyMode === mode}
                        >
                            <motion.span
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 1.1, opacity: 1 }}
                                transition={{ duration: 10.3, ease: "easeInOut" }}
                            >
                                {mode === "def" ? "📑" : mode === "card" ? "🃏" : "📋" }
                            </motion.span>
    
                        </ModeButton>
                    ))}
                </div>
                <div
                    className="mt-3 flex flex-col gap-3 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7 shadow-2xl"
                >
                    {uniqueParts.length >= 1 && (
                        <div className='flex flex-col gap-3'>
                            <ThemesDropdown
                                label={ t("choose_part_of_speech") }
                                value={selectedPart}
                                options={uniqueParts}
                                onChange={handlePartChange}
                                isTheme={false}
                            />
                            {themeArray.length >= 1 && (
                                <ThemesDropdown
                                    label={ t("choose_theme") }
                                    value={selectedTheme}
                                    options={themeArray}
                                    onChange={handleThemeChange}
                                    isTheme={true}
                                />
                            )}
                        </div>
                    )}
                    
                    {/* <label className="flex items-center space-x-2 cursor-pointer w-fit">
                        <input
                            type="checkbox"
                            checked={showPictures}
                            onChange={() => setShowPictures(prev => !prev)}
                            className="w-5 h-5 rounded focus:ring focus:ring-blue-300"
                        />
                        <span>{!showPictures ? t("show_image") : t("hide_image")}</span>
                    </label> */}
                    
                    { studyMode === "def" && 
                    <div className='flex gap-5 flex-col justify-center sm:flex-row sm:justify-between'>
                    
                        <StudyWordComponent
                            showApiExamples={showApiExamples}
                            workArray={workArray}
                            currentItem={currentItem}
                        />

                    {/* <AnimatePresence mode="wait">
                        { showPictures && <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="h-40 sm:w-auto shrink flex items-center justify-center">
                            {imageUrl && <img src={imageUrl} alt="Search result" className="h-full rounded-lg shadow-lg" />}
                        </motion.div>}
                    </AnimatePresence> */}
                </div>
                }


                <AnimatePresence>
                { studyMode === "card" && 
                    <Flashcard
                        workArray={workArray}
                        currentItem={currentItem}
                        sound={sound}
                        showApiExamples={showApiExamples}
                    />
                }
                </AnimatePresence>
                
                {studyMode !== "list" && <StudySwitchButtons
                    currentItem={currentItem}
                    workArray={workArray}
                    sound={sound}
                    setSound={setSound}
                    setCurrentItem={setCurrentItem}
                />}
                
                {studyMode === "list" && <ListMode 
                    workArray={workArray}
                    speak={speak}
                />}

                </div>
            </div>
        </motion.section>
    );
}





function ListMode({ workArray }) {
    const [openAcc, setOpenAcc] = useState(false);
    const [openItems, setOpenItems] = useState({});

    const toggleAccordion = (index) => {
        setOpenItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <motion.div
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full bg-[var(--light)] dark:bg-[var(--dark)] text-[var(--dark)] dark:text-[var(--light)] my-3 border rounded-lg shadow-md overflow-hidden"
        >
            <button
                className="w-full sticky top-0 flex justify-between items-center p-2 cursor-pointer hover:opacity-50 transition-opacity duration-300 border bg-[var(--light)] dark:bg-[var(--dark)] text-[var(--dark)] dark:text-[var(--light)]"
                onClick={() => setOpenAcc(prev => !prev)}
            >
                <span className="font-bold text-xl">Count: {workArray.length}</span>
            </button>

            <AnimatePresence mode="wait">
                {openAcc && (
                    <motion.div
                        initial={{ maxHeight: 0, opacity: 0 }}
                        animate={{ maxHeight: 300, opacity: 1 }}
                        exit={{ maxHeight: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-y-auto"
                    >
                        <div className="p-4 dark:text-[var(--light)] text-[var(--dark)]">
                            <ul className="text-xl">
                                {workArray.map((el, index) => (
                                    <li key={index} className="flex justify-between py-1 items-center">
                                        <div
                                            onClick={() => toggleAccordion(index)}
                                            className="flex flex-col max-w-[80%] cursor-pointer"
                                        >
                                            <span className="text-2xl font-bold">{el.word}</span>
                                            <span className="text-gray-500 max-w-[70%]">
                                                {getTranslation(el.translation, -1, "translation")}
                                            </span>

                                            {/* Анимация аккордеона без лагов */}
                                            <AnimatePresence>
                                                {openItems[index] && (
                                                    <motion.div
                                                        layout
                                                        initial={{ maxHeight: 0, opacity: 0 }}
                                                        animate={{ maxHeight: 200, opacity: 1 }}
                                                        exit={{ maxHeight: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="border-t py-2 text-gray-700 dark:text-gray-300">
                                                            {el.example.split("+").map((sentence, i) => (
                                                                <p key={i}>{sentence}</p>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <PlayIcon
                                            onClick={() => speak(el.word)}
                                            className="shrink-0 cursor-pointer hover:opacity-50 w-5 h-5 sm:w-8 sm:h-8 dark:text-[var(--light)] text-[var(--dark)]"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}