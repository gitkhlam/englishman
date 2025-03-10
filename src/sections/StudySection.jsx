import { useWordFilter } from "../hooks/useWordFilter";
import ThemesDropdown from '../components/ThemesDropdown';
import StudyWordComponent from '../components/study/StudyWordComponent';
import StudySwitchButtons from '../components/study/StudySwitchButtons';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";
import "../langConfig.js";

export default function StudySection({
    wordsData,
    uniqueParts,
    selectedPart,
    selectedTheme,
    setSelectedPart,
    setSelectedTheme,
    setUniqueParts,
    currentItem,
    setCurrentItem,
    sound,
    setSound,
    showApiExamples, // from settings window
    trigger,
}) {
    const { workArray, themeArray, handlePartChange, handleThemeChange } = useWordFilter({
        wordsData,
        selectedPart,
        selectedTheme,
        setSelectedPart,
        setSelectedTheme,
        setUniqueParts,
        trigger,
        setCurrentItem,
    });

    const { t } = useTranslation();
    
    // function speak of word
    const speak = (word) => {

        window.speechSynthesis.cancel(); // if prev speech doesn't stop

        if (!word) return;

        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';

        utterance.voice = window.speechSynthesis.getVoices().find(voice => (voice.name === "Samantha" || voice.name.includes("Google")) && voice.lang === "en-US");

        // speak
        window.speechSynthesis.speak(utterance);
    };


    return (
        <section className="w-full">
            <div
                className="max-w-170 mx-auto">
                <p className='p-4 text-[var(--dark)] dark:text-[var(--light)] text-4xl font-semibold text-center'>
                    { t("study_mode") }
                </p>
                <div
                    className="flex flex-col gap-3 w-full dark:text-[var(--light)] text-[var(--dark)] text-2xl rounded-lg bg-blue-200 dark:bg-gray-800 p-7"
                >
                    {uniqueParts.length >= 1 && (
                        <div className='flex flex-col gap-3'>
                            <ThemesDropdown
                                label={ t("choose_part_of_speech") }
                                value={selectedPart}
                                options={uniqueParts}
                                onChange={handlePartChange}
                            />
                            {themeArray.length >= 1 && (
                                <ThemesDropdown
                                    label={ t("choose_theme") }
                                    value={selectedTheme}
                                    options={themeArray}
                                    onChange={handleThemeChange}
                                />
                            )}
                        </div>
                    )}

                    <StudyWordComponent
                        speak={speak}
                        showApiExamples={showApiExamples}
                        workArray={workArray}
                        currentItem={currentItem}
                    />
                    <StudySwitchButtons
                        currentItem={currentItem}
                        workArray={workArray}
                        speak={speak}
                        sound={sound}
                        setSound={setSound}
                        setCurrentItem={setCurrentItem}
                    />
                </div>
            </div>
        </section>
    );
}
