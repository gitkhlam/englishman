import { motion } from 'framer-motion';
import "../../langConfig.js";
import { t } from 'i18next';

export default function StudySwitchButtons({ currentItem, workArray, speak, sound, setCurrentItem, setSound }) {

    // function processes click on next/prev button in study mode
    const handleSwitchButton = (nav) => {
        let current;
        if (nav === "next") {
            current = currentItem + 1 >= workArray.length ? currentItem : currentItem + 1;
        } else {
            current = currentItem - 1 <= 0 ? 0 : currentItem - 1
        }
        sound && speak(workArray[current].word); // if sound enable speak
        setCurrentItem(current);
    };

    return (
        <>
            <div className="flex justify-center items-center mt-2 gap-5">

                <button
                    className="buttonStyle flex-1 sm:flex-none"
                    disabled={currentItem === 0}
                    onClick={() => handleSwitchButton("prev")}
                >
                    <span className='sm:hidden'>⬅️</span>
                    <span className='hidden sm:block'>⬅️ {t("prev")}</span>
                </button>
                <p>
                    {currentItem + 1}/{workArray.length}
                </p>
                <span
                    className='cursor-pointer hover:opacity-70'
                    onClick={() => setSound(prev => !prev)}
                >
                    {sound ? "🔊" : "🔇"}
                </span>
                <button
                    className="buttonStyle flex-1 sm:flex-none"
                    disabled={currentItem === workArray.length - 1}
                    onClick={() => handleSwitchButton("next")}
                >
                    <span className='sm:hidden'>➡️</span>
                    <span className='hidden sm:block'>{t("next")} ➡️</span>
                </button>
            </div>



                {currentItem === workArray.length - 1 && (
                    <motion.div
                        key="start test"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="mt-4 flex justify-center">
                        <button
                            className="buttonStyle"
                            onClick={() => {
                                setCurrentItem(0);
                            }}
                        >
                            {t("start_test")}
                        </button>
                    </motion.div>
                )}
        </>
    )
}