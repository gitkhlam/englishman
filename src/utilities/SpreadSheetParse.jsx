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
                            word: (normalizedRow.word).trim() || '', 
                            translation: (normalizedRow.translation).trim() || '',
                            example: (normalizedRow.example).trim() || '',
                            partOfSpeech: (normalizedRow["part of speech"]).trim().toLowerCase() || '', 
                            theme: (normalizedRow.theme).trim() || '',
                        };
                    });
                    
                    resolve(parsedData.filter((word) => word.translation && word.word));
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