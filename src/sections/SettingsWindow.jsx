import { useEffect, useState } from 'react';
import HeaderSection from './HeaderSection';
import SettingsMenu from '../components/settings/SettingsMenu';
import GoogleSettings from '../components/settings/GoogleSettings';
import { AnimatePresence, motion } from 'framer-motion';

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
    setGoogleLink,
    wrongWords,
    mistakeMode,
    setMistakeMode
}) {
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setSettingsVisible(false);
            setMistakeMode(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const [loading, setLoading] = useState(false);
    const [showGoogleSettings, setShowGoogleSettings] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -200 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed z-51 inset-0 flex flex-col min-w-[320px] backdrop-blur-xs overflow-auto"
        >
            {loading && (
                <div className="fixed inset-0 w-[100dvw] h-[100dvh] bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] flex items-center justify-center z-99 text-5xl font-bold">
                    Loading...⏳
                </div>
            )}
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
                    <span className="text-xl">settings</span>
                </div>
            </HeaderSection>
            <div
                className="grow flex flex-col gap-5 justify-center items-center w-full container pb-5"
                onClick={handleBackgroundClick}
            >
                {!showGoogleSettings && (
                    <SettingsMenu
                        showApiExamples={showApiExamples}
                        sound={sound}
                        setSound={setSound}
                        setShowApiExamples={setShowApiExamples}
                        setGoogleSpread={setGoogleSpread}
                        googleLink={googleLink}
                        googleSpread={googleSpread}
                        setShowGoogleSettings={setShowGoogleSettings}
                        wrongWords={wrongWords}
                        setMistakeMode={setMistakeMode}
                        setSettingsVisible={setSettingsVisible}
                    />
                )}
                <AnimatePresence mode="wait">
                    {showGoogleSettings && (
                        <motion.div
                            key="google-settings"
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 200 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <GoogleSettings
                                googleLink={googleLink}
                                setGoogleLink={setGoogleLink}
                                setLoading={setLoading}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                
            </div>
        </motion.div>
    );
}

function MistakeComponent({ wrongWords }) {
    
    useEffect(() => {
        document.body.style.userSelect = 'none';
        return () => {
            document.body.style.userSelect = '';
        };
    }, []);

    return (
        <div className=' select-auto'>
            <ul>
                { wrongWords.map((el, ind) => <li key={ind}>{el.word}</li>)}
            </ul>
        </div>
    )
}