import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../langConfig.js";
import { t } from 'i18next';

export default function MistakeSection({ wrongWords, setMistakeTest, setTestMode, setCurrentItem }) {
    const navigate = useNavigate();
    return (
        <motion.div
            key="mistake-test-section"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -200 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="w-full flex justify-center"
        >
            <div className="max-w-full sm:max-w-[650px] flex flex-col justify-center">
                <p className="text-[var(--dark)] dark:text-[var(--light)] text-center text-3xl font-bold">
                    {t("mistake_list_header")}
                </p>
                <p className="mt-2 text-[var(--dark)] dark:text-[var(--light)] text-xl font-medium">
                    {`${t("you_have")} ${wrongWords.length} ${t("weak")} ${wrongWords.length > 1 ? t("words") : t("word").toLowerCase()}`}
                </p>
                {wrongWords.length > 0 &&
                    <>
                        <div className="mt-4 max-h-[400px] overflow-y-auto text-[var(--dark)] dark:text-[var(--light)] w-full border border-gray-300 dark:border-gray-600">
                            <div className="w-full overflow-x-auto">
                                <table className="w-full min-w-[500px] border-collapse border border-gray-300 dark:border-gray-600">
                                    <thead>
                                        <tr className="bg-gray-200 dark:bg-gray-700 text-sm sm:text-lg">
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">№</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">{t("word")}</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">{t("translation")}</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">{t("example")}</th>
                                            <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left">{t("part_of_speech")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wrongWords.map((el, ind) => (
                                            <tr key={ind} className="odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900 text-sm sm:text-lg">
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{ind + 1 + ")"}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 cursor-pointer hover:opacity-70">{el.word}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{el.translation}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{el.example.split("+").join("; ")}</td>
                                                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">{el.partOfSpeech}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setTestMode("choice");
                                setCurrentItem(0);
                                setMistakeTest(true);
                                navigate("/englishman/test"); // Переход на тест
                            }}
                            className="mt-5 buttonStyle text-xl font-medium"
                        >
                            {t("start_test")}
                        </button>
                    </>
                }
            </div>
        </motion.div>
    );
}

