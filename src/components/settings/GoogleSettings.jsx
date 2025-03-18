import { useState } from 'react';
import { ChevronDown } from "lucide-react";
import { motion } from 'framer-motion';
import SpreadsheetParser from '../../utilities/SpreadSheetParse';
import "../../langConfig.js";
import { useTranslation } from 'react-i18next';

export default function GoogleSettings({ googleLink, setGoogleLink, setLoadingData }) {

    const { t } = useTranslation();

    const [inputLink, setInputLink] = useState(""); // state for input link
    const [openAcc, setOpenAcc] = useState(false);
    const [openAcc12, setOpenAcc12] = useState(false);


    const handleAddLinkButton = async () => {

        if (inputLink !== "") {
            const rightData = await loadData();

            if (rightData) {
                setGoogleLink(inputLink);
                localStorage.setItem("googleLink", inputLink);
            } else alert(t("something_wrong"))
        }
        setInputLink("");
    }

    async function loadData() {
        try {
            setLoadingData(true);
            const data = await SpreadsheetParser(inputLink);
            console.log(data);
            
            setLoadingData(false);
            return data !== null && data.length > 0;
        } catch (error) {
            console.log("Failed to load data. Please try again later.");
            setLoadingData(false);
            return false;
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, x: "100vw", y: "100vh", scale: 0.55 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: "-100vw", y: "-100vh", scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className='rounded-lg dark:bg-[var(--light)] text-[var(--light)] border bg-[var(--dark)] dark:text-[var(--dark)] p-5 w-full sm:max-w-3xl'>
            <span className='font-semibold text-2xl sm:text-3xl'>
                {t("google_settings_hello")}
            </span>
            <div className="my-3 border rounded-lg shadow-md overflow-hidden">
                <button
                    className="w-full flex justify-between items-center p-2 cursor-pointer hover:opacity-50 transition-opacity duration-900"
                    onClick={() => setOpenAcc(prev => !prev)}
                >
                    <span className="font-bold text-xl">{t("instruction")}</span>
                    <ChevronDown
                        className={`duration-500 ease-in-out transform transition-transform ${openAcc ? "rotate-180" : "rotate-0"}`}
                    />
                </button>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: openAcc ? 'auto' : 0, opacity: openAcc ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <div className="p-4 border-t text-[var(--light)] dark:text-gray-700">
                        <ul className='text-xl'>
                            <li>{t("instruction_list_1") }</li>
                            <li>{t("instruction_list_2")}</li>
                            <li>
                                {t("instruction_list_3")}
                                <ul className='list-disc pl-4'>
                                    <li>{t("instruction_list_3_1")}</li>
                                    <li>{t("instruction_list_3_11")}</li>

                                    <li>{t("instruction_list_3_2")}</li>
                                    <li>{t("instruction_list_3_3")}</li>
                                </ul>
                            </li>
                            <li>{t("instruction_list_4")}</li>
                            <li>{t("instruction_list_5")}</li>
                            <li className='mt-4'>
                                <button onClick={() => setOpenAcc12(prev => !prev)} 
                                    className='select-none text-xl font-semibold border py-1 px-2 rounded-lg cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] hover:opacity-50'>{openAcc12 ? t("hide_image_google_sh") : t("show_image_google_sh")}</button>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: openAcc12 ? 'auto' : 0, opacity: openAcc12 ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    className="overflow-hidden py-2"
                                >
                                    <span>{t("example_google_img")}</span>
                                    <img className='select-none' src="gsh.png" alt="googlesheet" />
                                </motion.div>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
            <span className='text-xl font-bold'>{t("important_google")}</span>
            {googleLink !== null && (
                <div className='mt-5 text-xl font-medium underline'>
                    <a href={googleLink}>{t("cur_link")}</a>
                </div>
            )}
            <div className='mt-3'>
                <p className='text-xl font-bold'>{t("paste_link")}</p>
                <div className='mt-2 flex items-center gap-2 flex-wrap'>
                    <input
                        type="text"
                        placeholder='google sheet link..'
                        className='border rounded-lg px-2 py-1'
                        value={inputLink}
                        onChange={(e) => setInputLink(e.target.value)}
                    />
                    <button
                        className='select-none text-xl font-semibold border py-1 px-2 rounded-lg cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] hover:opacity-50'
                        onClick={handleAddLinkButton}
                    >
                        {t("add")}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}