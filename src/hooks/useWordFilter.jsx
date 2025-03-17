// useWordFilter.js
import { useMemo, useEffect } from "react";

export function useWordFilter({
    wordsData,
    selectedPart,
    selectedTheme,
    setSelectedPart,
    setSelectedTheme,
    setUniqueParts,
    trigger,
    setCurrentItem,
}) {
    
    // set of unique parts of speech, exclude empty string    
    useEffect(() => {
        setUniqueParts(
            [...new Set(
                wordsData.flatMap((word) => word.partOfSpeech.split('/').map(p => p.trim()))
            )].filter(word => word !== "")
        );
    }, [wordsData, setUniqueParts]);

    // sets array of selected parts of speech
    const filteredWords = useMemo(() => {
        if (!wordsData.length) return [];
        return selectedPart === "all"
            ? wordsData
            : wordsData.filter((word) =>
                word.partOfSpeech.split('/').map(p => p.trim()).includes(selectedPart)
            );
    }, [selectedPart, wordsData]);


    // sets final work array of selected theme
    const workArray = useMemo(() => {
        if (!wordsData.length) return [];
        return selectedTheme === "all"
            // [...filteredWords] to prevent mutation of filteredWords!
            ? [...filteredWords].sort(() => 0.5 - Math.random())
            : [...filteredWords]
                .sort(() => 0.5 - Math.random())
                .filter((word) => word.theme === selectedTheme);
    }, [selectedTheme, filteredWords, trigger]); // trigger from App is a switcher value to recognize Logo is clicked or not

    // sets array of themes if filteredWords has changed
    const themeArray = useMemo(() => {
        if (!wordsData.length) return [];
        return [...new Set(filteredWords.map((word) => word.theme))].filter(
            (theme) => theme.trim() !== ""
        );
    }, [filteredWords]);

    // processes changes of part
    const handlePartChange = (part) => {
        setSelectedPart(part);
        setSelectedTheme("all");
        setCurrentItem(0);
    };
    
    // processes changes of theme
    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
        setCurrentItem(0);
    };

    return {
        workArray,
        themeArray,
        handlePartChange,
        handleThemeChange,
    };
}