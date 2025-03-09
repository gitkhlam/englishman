import { useState, useEffect, useMemo } from 'react';
import ExamplesComponent from './ExamplesComponent';
import { motion, AnimatePresence } from 'framer-motion';


export default function StudyWordComponent({
    speak,
    showApiExamples,
    workArray,
    currentItem,
}) {

    
    const [exampleSentences, setExampleSentences] = useState([]); // state for examples
    const [loadingSentences, setLoadingSentences] = useState(false); // state for loading sentences

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
            setLoadingSentences(false);
        }
    };

    // fetch when currentItem or workArray have changed
    useEffect(() => {
        if (workArray[currentItem]?.word) {
            setExampleSentences([]);
            showApiExamples && fetchExampleSentences(workArray[currentItem].word); // if enabled - fetch
        }
    }, [workArray, currentItem, showApiExamples]);

    
    const localExamples = useMemo(() => {
        if (!workArray || workArray.length === 0 || !workArray[currentItem]) {
            return []; 
        }
        return workArray[currentItem].example.split("+");
    }, [workArray, currentItem]);

    const apiExamples = useMemo(
        () => exampleSentences.slice(0, 3),
        [exampleSentences]
    );

    const renderExamples = (condition, array, isApi) => (
        condition && (
            <ExamplesComponent
                exampleArray={array}
                speak={speak}
                isApi={isApi}
            />
        )
    );


    return (
        <div className="flex flex-col gap-3">    
            
                <motion.p
                    key={`${workArray[currentItem]}-word`} 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }} 
                    transition={{ duration: 0.4, ease: "easeOut" }} 
                    className="break-words overflow-hidden"
                >
                    Word:{" "}
                    <motion.span
                        className="cursor-pointer py-1 px-2 rounded-lg bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] text-2xl font-semibold hover:opacity-70"
                        onClick={() => speak(workArray[currentItem].word)}
                    >
                        { workArray.length > 0 && workArray[currentItem].word}
                    </motion.span>
                </motion.p>

                <motion.p
                    key={`${workArray[currentItem]}-translation`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="break-words overflow-hidden" 
                >
                    Translation:{" "}
                    <span 
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-2xl font-semibold">
                        { workArray.length > 0 && workArray[currentItem].translation}
                    </span>
                </motion.p>

            {loadingSentences ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    Loading examples... ⏳
                </motion.div>
            ) : (
                    <motion.div
                        key={`${workArray[currentItem]}-examples`} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {renderExamples(
                            !showApiExamples && workArray.length > 0 && workArray[currentItem].example.length >= 1,
                            localExamples,
                            false
                        )}
                        {renderExamples(exampleSentences.length > 0, apiExamples, true)}
                    </motion.div>
            )}
        </div>
    )
}