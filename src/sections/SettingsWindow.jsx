import { useEffect, useState } from 'react';
import HeaderSection from './HeaderSection';
import SettingsMenu from '../components/settings/SettingsMenu';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

export default function SettingsWindow({
    theme,
    setTheme,
    setSettingsVisible,
    resetAll,
    sound,
    setSound,
    showApiExamples,
    setShowApiExamples,
    googleSpread,
    setGoogleSpread,
    googleLink,
    wrongWords,
    setMistakeTest,
    showApiMenu
}) {
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setSettingsVisible(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -200 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed z-51 inset-0 flex flex-col min-w-[320px] backdrop-blur-xs overflow-auto"
        >
            <HeaderSection
                theme={theme}
                setTheme={setTheme}
                setSettingsVisible={setSettingsVisible}
                logoClick={(e) => {
                    e.stopPropagation();
                    resetAll();
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center">
                    EnglishMan <br />
                    <span className="text-xl">{ t('settings')}</span>
                </div>
            </HeaderSection>
            <div
                className="grow flex flex-col gap-5 justify-center items-center w-full container pb-5"
                onClick={handleBackgroundClick}
            >
                <SettingsMenu
                    showApiExamples={showApiExamples}
                    sound={sound}
                    setSound={setSound}
                    setShowApiExamples={setShowApiExamples}
                    setGoogleSpread={setGoogleSpread}
                    googleLink={googleLink}
                    googleSpread={googleSpread}
                    wrongWords={wrongWords}
                    setSettingsVisible={setSettingsVisible}
                    setMistakeTest={setMistakeTest}
                    showApiMenu={showApiMenu}
                />
            </div>
        </motion.div>
    );
}

