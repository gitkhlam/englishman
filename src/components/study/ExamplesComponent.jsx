import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../../langConfig.js";

export default function ExamplesComponent({ exampleArray, speak, isApi }) {
    const [accordionOpen, setAccordionOpen] = useState(false);
    
    useEffect(() => {
        setAccordionOpen(false);
                
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
                            className="cursor-pointer text-2xl font-semibold hover:opacity-70"
                            onClick={() => speak(example)}
                        >
                            {`${exampleArray.length > 1 ? index + 1 + ". " : ""}${example}`}
                        </li>
                    ))}
                </motion.ul>

        </div>
    )
}