import { useState, useEffect } from 'react';

export default function ReadFileCsv() {    
    const [wordsData, setWordsData] = useState([])
    
    useEffect(() => {
        fetch("/english.csv")
            .then((response) => response.text())
            .then((text) => {
                const delimiter = text.includes(";") ? ";" : ",";
                const rows = text.split("\n").map((row) => row.split(delimiter));

                const headers = rows[0].map((h) => h.trim());
                const wordIndex = headers.indexOf("Word");
                const translationIndex = headers.indexOf("Translation");
                const exampleIndex = headers.indexOf("Example");
                const partIndex = headers.indexOf("Part of speech");
                const themeIndex = headers.indexOf("Theme");

                if ([wordIndex, translationIndex, exampleIndex, partIndex, themeIndex].includes(-1)) alert('No columns');

                const wordsData = rows.slice(1)
                    .map((row) => ({
                        word: row[wordIndex]?.trim(),
                        translation: row[translationIndex]?.trim(),
                        example: row[exampleIndex]?.trim(),
                        theme: row[themeIndex]?.trim(),
                        partOfSpeech: row[partIndex]?.trim(),
                    }))
                    .filter((word) => word.translation); // Исключаем пустые строки

                setWordsData(wordsData);                
            })
            .catch((error) => console.error("Ошибка загрузки CSV:", error));
    }, []);
    return wordsData;
}