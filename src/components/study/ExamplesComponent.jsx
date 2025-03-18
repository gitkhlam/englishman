import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../../langConfig.js";
import axios from 'axios';
import { LanguageIcon } from "@heroicons/react/24/solid";
import { speak } from '../../Sound.js';
import i18n from '../../langConfig.js';

export default function ExamplesComponent({ exampleArray, isApi }) {
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [translatedText, setTranslatedText] = useState({});
    


    const handleTranslate = async (example, index) => {
        console.log(i18n.language);
        
        if (translatedText[index] !== undefined && Object.keys(translatedText).length > 0){
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

    useEffect(() => {
        setAccordionOpen(false);
        setTranslatedText({})
    }, [exampleArray]);

    const { t } = useTranslation();
    
    return (
        <div className="break-words">
            <button
                className="flex items-center gap-2 cursor-pointer bg-[var(--dark)] dark:bg-[var(--light)] text-[var(--light)] dark:text-[var(--dark)] font-medium p-2 rounded-lg hover:opacity-70"
                onClick={() => setAccordionOpen((prev) => !prev)}
            >
                {exampleArray.length > 1
                    ? `${isApi ? "API" : ""} ${t("examples")}`
                    : `${isApi ? "API" : ""} ${t("example")}`}
                <p className={`w-fit duration-500 ease-in-out transform transition-transform ${accordionOpen ? "-rotate-90" : "rotate-0"}`}>
                    👈
                </p>
            </button>
            
                <motion.ul
                    key="list-examples"
                    initial={false} // Чтобы не анимировать при первом рендере
                    animate={accordionOpen ? "open" : "closed"} // Состояния
                    variants={{
                        open: {
                            opacity: 1,
                            height: "auto",
                            marginTop: "12px", // Аналог mt-3
                            transition: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        },
                        closed: {
                            opacity: 0,
                            height: 0,
                            marginTop: "0px",
                            transition: {
                                duration: 0.3,
                                ease: "easeIn",
                            },
                        },
                    }}
                    className="overflow-hidden" // Чтобы контент не торчал при закрытии
                >
                    {exampleArray.map((example, index) => (
                        <li
                            key={index}
                        >
                            <span
                                onClick={() => speak(example)}
                                className="cursor-pointer text-2xl font-semibold hover:opacity-70"
                            >
                                {`${exampleArray.length > 1 ? index + 1 + '. ' : ''}${translatedText[index] || example}`}
                                <LanguageIcon
                                    onClick={(e) => { e.stopPropagation(); handleTranslate(example, index)}}
                                    className="w-5 h-5 cursor-pointer hover:opacity-40 inline-block align-middle ml-2"
                                />
                            </span>

                        </li>
                    ))}
                </motion.ul>

        </div>
    )
}




