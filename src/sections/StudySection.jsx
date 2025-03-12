import { useWordFilter } from "../hooks/useWordFilter";
import ThemesDropdown from '../components/ThemesDropdown';
import StudyWordComponent from '../components/study/StudyWordComponent';
import StudySwitchButtons from '../components/study/StudySwitchButtons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../langConfig.js";
import { useState, useEffect } from 'react';

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
                <div
                    className="flex flex-col gap-3 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7 shadow-2xl"
                >
                    {uniqueParts.length >= 1 && (
                        <div className='flex flex-col gap-3'>
                            <ThemesDropdown
                                label={ t("choose_part_of_speech") }
                                value={selectedPart}
                                options={uniqueParts}
                                onChange={handlePartChange}
                            />
                            {themeArray.length >= 1 && (
                                <ThemesDropdown
                                    label={ t("choose_theme") }
                                    value={selectedTheme}
                                    options={themeArray}
                                    onChange={handleThemeChange}
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
                    
                    <div className='flex gap-5 flex-col justify-center sm:flex-row sm:justify-between'>
                    
                        <StudyWordComponent
                            speak={speak}
                            showApiExamples={showApiExamples}
                            workArray={workArray}
                            currentItem={currentItem}
                        />

                    <AnimatePresence mode="wait">
                        { showPictures && <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="h-40 sm:w-auto shrink flex items-center justify-center">
                            {imageUrl && <img src={imageUrl} alt="Search result" className="h-full rounded-lg shadow-lg" />}
                        </motion.div>}
                    </AnimatePresence>
                </div>
                    <StudySwitchButtons
                        currentItem={currentItem}
                        workArray={workArray}
                        speak={speak}
                        sound={sound}
                        setSound={setSound}
                        setCurrentItem={setCurrentItem}
                    />
                </div>
            </div>
        </motion.section>
    );
}
