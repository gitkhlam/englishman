import { AnimatePresence, motion } from 'framer-motion';
import "../../langConfig.js";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { routeEnglishman } from '../../App.jsx';
import { speak } from '../../Sound.js';

export default function StudySwitchButtons({ currentItem, workArray, sound, setCurrentItem, setSound, isTrans, studyMode }) {

    const { t } = useTranslation();
    
    const navigate = useNavigate(); // Для программной навигации

    // function processes click on next/prev button in study mode
    const handleSwitchButton = (nav) => {
        let current;
        if (nav === "next") {
            current = currentItem + 1 >= workArray.length ? currentItem : currentItem + 1;
        } else {
            current = currentItem - 1 <= 0 ? 0 : currentItem - 1
        }
        (studyMode === "card" && !isTrans) || (sound && speak(workArray[current].word)); // if sound enable speak
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
                    onClick={() => setSound(prev => {
                        localStorage.setItem('soundStatus', !prev);
                        return !prev;
                    })}
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


                <AnimatePresence mode='wait'>
                {currentItem === workArray.length - 1 && (

                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <button
                        className="buttonStyle"
                        onClick={() => {
                            setCurrentItem(0);
                            navigate(`${routeEnglishman}/test`);
                        }}
                    >
                        {t("start_test")}
                    </button>

                </motion.div>

                )}
            </AnimatePresence>
        </>
    )
}