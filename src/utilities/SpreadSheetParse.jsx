import axios from 'axios';
import Papa from 'papaparse';

const SpreadsheetParser = async (url) => {
    try {
        const response = await axios.get(url);
        return new Promise((resolve, reject) => {
            Papa.parse(response.data, {
                header: true,
                complete: (result) => {
                    const parsedData = result.data.map((row) => {
                        const normalizedRow = Object.fromEntries(
                            Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
                        );

                        return {
                            word: (normalizedRow.word || '').trim(), 
                            translation: normalizedRow.translation || '',
                            example: normalizedRow.example || '',
                            partOfSpeech: normalizedRow["part of speech"] || '', 
                            theme: normalizedRow.theme || '',
                        };
                    });
                    resolve(parsedData);
                },
                error: (error) => reject(error),
                skipEmptyLines: true,
            });
        });
    } catch (error) {
        console.error('Failed to fetch', error);
        return null;
    }
};

export default SpreadsheetParser;