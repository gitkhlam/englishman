import { useWordFilter } from "../hooks/useWordFilter";
import ThemesDropdown from '../components/ThemesDropdown';
import StudyWordComponent from '../components/study/StudyWordComponent';
import StudySwitchButtons from '../components/study/StudySwitchButtons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../langConfig.js";
import { useState, useCallback, useMemo, useEffect } from 'react';
import ModeButton from '../components/WorkModeButton.jsx';
import { Flashcard } from '../components/study/FlashCard.jsx';
import { getTranslation } from '../langConfig.js';
import { PlayIcon } from "@heroicons/react/24/solid";
import { speak, playSound } from '../Sound.js';
import { LanguageIcon, ArrowPathIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import i18n from '../langConfig.js';



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

        
    const [isTrans, setIsTrans] = useState(true);
    const [examplesMode, setExamplesMode] = useState(false);


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
                <>
                    <div className='flex gap-2'>
                        <ArrowPathIcon
                            onClick={() => {
                                playSound("click.mp3");
                                setIsTrans(prev => !prev);
                            }}
                            className={`w-5 h-5 ${!isTrans ? "text-green-400" :""} cursor-pointer hover:opacity-50`} />
                        <AcademicCapIcon
                            onClick={() => {
                                playSound("click.mp3");
                                setExamplesMode(prev => !prev);
                            }}
                            className={`w-5 h-5 ${examplesMode ? "text-green-400" : ""} cursor-pointer hover:opacity-50`} />
                    </div>
                            <Flashcard
                                workArray={workArray}
                                currentItem={currentItem}
                                sound={sound}
                                showApiExamples={showApiExamples}
                                isTrans={isTrans}
                                examplesMode={examplesMode}
                            />
                </>
                }
                </AnimatePresence>
                
                {studyMode !== "list" && <StudySwitchButtons
                    currentItem={currentItem}
                    workArray={workArray}
                    sound={sound}
                    setSound={setSound}
                    setCurrentItem={setCurrentItem}
                    isTrans={isTrans}
                    studyMode={studyMode}
                />}
                
                {studyMode === "list" && <ListMode 
                    workArray={workArray}
                    speak={speak}
                    showApiExamples={showApiExamples}
                />}

                </div>
            </div>
        </motion.section>
    );
}





function ListMode({ workArray, showApiExamples }) {
    const [openAcc, setOpenAcc] = useState(false);
    const [openItems, setOpenItems] = useState({});
    const [translatedText, setTranslatedText] = useState({}); // Теперь { wordIndex: { sentenceIndex: "перевод" } }
    const [exampleSentences, setExampleSentences] = useState({});
    const [loadingSentences, setLoadingSentences] = useState(false);

    useEffect(() => {
        setOpenAcc(false);
        setOpenItems({});
        setTranslatedText({});
        setExampleSentences({});
        setLoadingSentences(false);
    }, [showApiExamples])

    const { t } = useTranslation();

    const toggleAccordion = (word, index) => {
        if (showApiExamples && !exampleSentences[index]) {
            fetchExampleSentences(word, index);
        }
        setOpenItems((prev) => {
            const newOpenItems = {};
            Object.keys(prev).forEach((key) => {
                newOpenItems[key] = false;
            });
            newOpenItems[index] = !prev[index];
            return newOpenItems;
        });
    };

    const handleTranslate = async (example, wordIndex, sentenceIndex) => {
        // Проверяем, есть ли уже перевод для этого предложения
        if (translatedText[wordIndex]?.[sentenceIndex] !== undefined) {
            setTranslatedText((prev) => ({
                ...prev,
                [wordIndex]: {
                    ...prev[wordIndex],
                    [sentenceIndex]: undefined, // Сбрасываем перевод
                },
            }));
            return;
        }

        try {
            const response = await axios.get('https://api.mymemory.translated.net/get', {
                params: {
                    q: example,
                    langpair: `en|${i18n.language === 'ru' ? 'ru' : 'uk'}`,
                },
            });
            const translated = response.data.responseData.translatedText;
            setTranslatedText((prev) => ({
                ...prev,
                [wordIndex]: {
                    ...prev[wordIndex],
                    [sentenceIndex]: translated, // Сохраняем перевод для конкретного предложения
                },
            }));
        } catch (error) {
            console.error('Ошибка перевода:', error.message);
            setTranslatedText((prev) => ({
                ...prev,
                [wordIndex]: {
                    ...prev[wordIndex],
                    [sentenceIndex]: 'Ошибка перевода',
                },
            }));
        }
    };

    const fetchExampleSentences = async (word, index) => {
        try {
            setLoadingSentences(true);
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) throw new Error("Failed to fetch examples");
            const data = await response.json();
            const examples =
                data[0]?.meanings[0]?.definitions
                    .filter((def) => def.example)
                    .map((def) => def.example) || [];
            setExampleSentences((prev) => ({
                ...prev,
                [index]: examples,
            }));
        } catch (err) {
            console.error(err);
            setExampleSentences((prev) => ({
                ...prev,
                [index]: [],
            }));
        } finally {
            setTimeout(() => {
                setLoadingSentences(false);
            }, 1000);
        }
    };

    const apiExamples = useMemo(
        () => (index) => exampleSentences[index]?.slice(0, 3) || [],
        [exampleSentences]
    );

    const [search, setSearch] = useState("");

    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);


    const filteredArray = useMemo(() => {
        if (!search) return workArray; 

        return workArray.filter((el) =>
            el.word.toLowerCase().includes(search.toLowerCase()) ||
            el.translation.toLowerCase().includes(search.toLowerCase()) ||
            el.example.toLowerCase().includes(search.toLowerCase()) ||
            el.theme.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, workArray]);

    // Подсветка совпадений
    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="bg-blue-200 dark:bg-blue-900 px-[1px] rounded">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <motion.div
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full bg-[var(--light)] dark:bg-[var(--dark)] text-[var(--dark)] dark:text-[var(--light)] my-3 border rounded-lg shadow-md overflow-hidden"
        >
            <button
                className={`${openAcc ? "border-b": ""} w-full flex justify-between items-center p-2 cursor-pointer hover:opacity-50 transition-opacity duration-300 bg-[var(--light)] dark:bg-[var(--dark)] text-[var(--dark)] dark:text-[var(--light)]`}
                onClick={() => setOpenAcc((prev) => !prev)}
            >
                <span className="font-bold text-xl">{t("count_of_words")}{workArray.length}</span>
            </button>

            {openAcc && (
                <div className="p-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={handleSearchChange}
                        className="text-xl w-full px-2 py-1 border rounded-lg text-black dark:text-white dark:bg-gray-800"
                    />
                </div>
            )}

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
                                {filteredArray.map((el, index) => (
                                    <li key={index} className="flex justify-between py-1 items-center">
                                        <div
                                            onClick={() => toggleAccordion(el.word, index)}
                                            className="flex flex-col max-w-[90%] cursor-pointer"
                                        >
                                            <span className="hover:opacity-60 text-2xl font-bold">
                                                {highlightMatch(el.word, search)}
                                            </span>
                                            <span className="hover:opacity-60 text-[var(--dark)] dark:text-[var(--light)] max-w-[90%]">
                                                {highlightMatch(getTranslation(el.translation, -1, "translation"), search)}
                                            </span>

                                            <AnimatePresence>
                                                {openItems[index] && (
                                                    <motion.div
                                                        layout
                                                        initial={{ maxHeight: 0, opacity: 0 }}
                                                        animate={{ maxHeight: 700, opacity: 1 }}
                                                        exit={{ maxHeight: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="border-t py-2 text-gray-700 dark:text-gray-300">
                                                            {!showApiExamples &&
                                                                el.example.length > 0 && el.example.split("+").map((sentence, i) => (
                                                                    <p className='hover:opacity-60'
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            speak(sentence);
                                                                        }}
                                                                        key={`${i}ab`}
                                                                    >
                                                                        {translatedText[index]?.[i] || sentence}
                                                                        <LanguageIcon
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleTranslate(sentence, index, i);
                                                                            }}
                                                                            className="w-5 h-5 cursor-pointer hover:opacity-40 inline-block align-middle ml-2"
                                                                        />
                                                                    </p>
                                                                ))}
                                                            {showApiExamples && (
                                                                loadingSentences ? (
                                                                    <>LOADING</>
                                                                ) : (
                                                                    apiExamples(index).length > 0 &&
                                                                    apiExamples(index).map((elm, ind) => (
                                                                        <p
                                                                            key={`${ind}ba`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                speak(elm);
                                                                            }}
                                                                            className="text-center text-sm italic cursor-pointer font-semibold hover:opacity-70"
                                                                        >
                                                                            {translatedText[index]?.[ind] || elm}
                                                                            <LanguageIcon
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleTranslate(elm, index, ind);
                                                                                }}
                                                                                className="w-5 h-5 cursor-pointer hover:opacity-40 inline-block align-middle ml-2"
                                                                            />
                                                                        </p>
                                                                    ))
                                                                )
                                                            )}
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