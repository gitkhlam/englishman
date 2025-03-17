import { useState, useEffect, useMemo } from 'react';
import ExamplesComponent from './ExamplesComponent';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../../langConfig.js";
import { getTranslation } from '../../langConfig.js';
import { speak } from '../../Sound.js';


export default function StudyWordComponent({
    showApiExamples,
    workArray,
    currentItem,
}) {
    const [exampleSentences, setExampleSentences] = useState([]);
    const [loadingSentences, setLoadingSentences] = useState(false);

    const { t } = useTranslation();
    
    // fetching examples 
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

    useEffect(() => {
        if (workArray[currentItem]?.word) {
            setExampleSentences([]);
            showApiExamples && fetchExampleSentences(workArray[currentItem].word);
        }
    }, [workArray, currentItem, showApiExamples]);
    

    const localExamples = useMemo(() => {
        if (!workArray || workArray.length === 0 || !workArray[currentItem]) {
            return [];
        }
        return workArray[currentItem].example.split("+");
    }, [workArray, currentItem]);

    const apiExamples = useMemo(
        () => exampleSentences.slice(0, 3), // get first 3 examples
        [exampleSentences]
    );


    const renderExamples = (condition, array, isApi) => (
        condition && (
            <ExamplesComponent
                exampleArray={array}
                isApi={isApi}
            />
        )
    );

    return (
        <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, height: "auto" }}
            animate={{ opacity: 1, height: "auto", transition: { duration: 0.3 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
        >
            <div>
                <p className="break-words overflow-hidden">
                    {t("word")}:{" "}
                    <button
                        className="cursor-pointer px-2 rounded-lg bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] text-2xl font-semibold hover:opacity-70"
                        onClick={() => speak(workArray[currentItem].word)}
                    >
                        { workArray.length > 0 && workArray[currentItem].word }
                    </button>
                </p>
            </div>

            <div>
                <p className="break-words overflow-hidden">
                    {t("translation")}:{" "}
                    <span className="text-2xl font-semibold">
                        {workArray.length > 0 && getTranslation(workArray, currentItem) }
                    </span>
                </p>
            </div>

            <div>
                <p className="break-words overflow-hidden">
                    {t("part_of_speech")}:{" "}
                    <span className="text-2xl font-semibold">
                        {workArray.length > 0 &&
                            t(workArray[currentItem].partOfSpeech)
                                .split("/")
                                .map((item) => t(item))
                                .join("/")
                        }                    
                    </span>
                </p>
            </div>

            {/* Анимация контейнера с примерами */}
            <motion.div
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } }}
                exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
                className="overflow-hidden mt-2"
            >
                <AnimatePresence mode="wait">
                    {loadingSentences ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto", transition: { duration: 0.3 } }}
                            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                        >
                            {t("loading_examples")}
                        </motion.div>
                    ) : (
                        (exampleSentences.length > 0 || (!showApiExamples && localExamples.length > 0)) && (
                            <motion.div
                                key="examples"
                                initial={{ opacity: 0, height: 0, x: 20 }}
                                animate={{ opacity: 1, height: "auto", x: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
                                exit={{ opacity: 0, height: 0, x: 20, transition: { duration: 0.3 } }}
                            >
                                {renderExamples(
                                    !showApiExamples && workArray.length > 0 && workArray[currentItem].example.length >= 1,
                                    localExamples,
                                    false
                                )}
                                {renderExamples(exampleSentences.length > 0, apiExamples, true)}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
