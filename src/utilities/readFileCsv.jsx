export default async function ReadFileCsv() {    
    let wordsData = [];
    
    const response = await fetch(import.meta.env.BASE_URL + "english.csv");
    const text = await response.text();

    const delimiter = text.includes(";") ? ";" : ",";
    const rows = text.split("\n").map((row) => row.split(delimiter));

    const headers = rows[0].map((h) => h.trim());
    const wordIndex = headers.indexOf("Word");
    const translationIndex = headers.indexOf("Translation");
    const exampleIndex = headers.indexOf("Example");
    const partIndex = headers.indexOf("Part of speech");
    const themeIndex = headers.indexOf("Theme");

    if ([wordIndex, translationIndex, exampleIndex, partIndex, themeIndex].includes(-1)) alert('No columns');

    wordsData = rows.slice(1)
        .map((row) => ({
            word: row[wordIndex]?.trim(),
            translation: row[translationIndex]?.trim(),
            example: row[exampleIndex]?.trim(),
            theme: row[themeIndex]?.trim(),
            partOfSpeech: row[partIndex]?.trim(),
        }))
        .filter((word) => word.translation && word.word); 

    return wordsData;
}