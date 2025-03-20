import { useState, useEffect, useMemo } from 'react';
import { getTranslation } from '../../langConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../../Sound';
import { LanguageIcon } from "@heroicons/react/24/solid";
import i18n from '../../langConfig';
import axios from 'axios';

export const Flashcard = ({ sound, workArray, currentItem, showApiExamples, isTrans, examplesMode }) => {
    const [flipped, setFlipped] = useState(false);
    const [currentWord, setCurrentWord] = useState(workArray[currentItem].word);
    const [currentTranslation, setCurrentTranslation] = useState(getTranslation(workArray, currentItem));
    const [currentExample, setCurrentExample] = useState(workArray[currentItem].example);
    const [translatedText, setTranslatedText] = useState({});

    const handleTranslate = async (example, index) => {
        if (translatedText[index] !== undefined && Object.keys(translatedText).length > 0) {
            setTranslatedText((prev) => ({
                ...prev,
                [index]: undefined,
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
                [index]: translated,
            }));
        } catch (error) {
            console.error('Ошибка перевода:', error.message);
            setTranslatedText((prev) => ({
                ...prev,
                [index]: 'Ошибка перевода',
            }));
        }
    };

    const handleClick = () => {
        setFlipped(!flipped);
        sound && speak(workArray[currentItem].word);
    }

    useEffect(() => {
        setTimeout(() => {
            setCurrentTranslation(workArray.length > 0 && getTranslation(workArray, currentItem));
            setCurrentExample(workArray[currentItem].example);
            if (workArray[currentItem]?.word) {
                setExampleSentences([]);
                showApiExamples && fetchExampleSentences(workArray[currentItem].word);
            }
            setTranslatedText({});

        }, 300);
        !isTrans && flipped && setCurrentTranslation(workArray.length > 0 && getTranslation(workArray, currentItem));

        setTimeout(() => {
            setCurrentWord(workArray[currentItem].word);
        }, 200);

        !examplesMode && setFlipped(prev => prev === true && false);
        
    }, [currentItem, workArray, showApiExamples]);


    const [exampleSentences, setExampleSentences] = useState([]);
    const [loadingSentences, setLoadingSentences] = useState(false);

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
            setTimeout(() => {
                setLoadingSentences(false);
            }, 1000);
        }
    };


    const apiExamples = useMemo(
            () => exampleSentences.slice(0, 3), // get first 3 examples
            [exampleSentences]
        );


    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: { duration: 0.5 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.5 } }}
            className="flex justify-center items-center">
            <AnimatePresence mode='wait'>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-80 h-48 perspective-1000 cursor-pointer"
                    onClick={handleClick}
                >
                    <motion.div
                        className="relative w-full h-full"
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div className="hover:opacity-70 transition-all duration-500 absolute w-full h-full flex items-center justify-center bg-[var(--light)] dark:bg-gray-900 dark:text-[var(--light)] text-3xl font-bold rounded-2xl shadow-2xl backface-hidden p-4">
                            {isTrans ? currentWord : currentTranslation}
                        </div>
                        <div className="absolute w-full h-full flex flex-col items-center 
                            bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-gray-800 
                            p-4 rounded-2xl shadow-lg backface-hidden rotate-y-180 
                            overflow-y-auto max-h-full min-h-0">
                            <div className="flex flex-col items-center justify-center flex-grow p-4">
                                <p className="text-3xl font-semibold break-all mb-3">{isTrans ? currentTranslation : currentWord}</p>
                                {workArray.length > 0 && workArray[currentItem].example.length >= 1 && !showApiExamples && 
                                    currentExample.split("+").map((el, index) =>
                                        <span key={el} 
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                speak(el);
                                            }}  
                                            className="text-center text-sm italic cursor-pointer font-semibold hover:opacity-70">
                                                {translatedText[index] || el}
                                                <LanguageIcon
                                                    onClick={
                                                        (e) => { e.stopPropagation(); handleTranslate(el, index); }
                                                    }
                                                    className="w-5 h-5 cursor-pointer hover:opacity-40 inline-block align-middle ml-2"
                                                />
                                        </span>                                    
                                    )}
                                {showApiExamples && 
                                loadingSentences ? <>LOADING</> :
                                exampleSentences.length > 0 &&
                                    apiExamples.map((el, index) =>
                                            <span key={el}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    speak(el);
                                                }}
                                                className="text-center text-sm italic cursor-pointer font-semibold hover:opacity-70">
                                                {translatedText[index] || el}

                                                <LanguageIcon
                                                    onClick={
                                                        (e) => { e.stopPropagation(); handleTranslate(el, index); }
                                                    }
                                                    className="w-5 h-5 cursor-pointer hover:opacity-40 inline-block align-middle ml-2"
                                                />
                                            </span>
                                            
                                    )
                                }
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </motion.div>

    );
};