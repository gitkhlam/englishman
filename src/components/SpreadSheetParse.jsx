import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function SpreadsheetParser() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Замените на вашу ссылку
                const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBClUrqZ5TXINgJMwcCqelXPGIjSRoeOJoD8Yfe22a2XJMXuyewITYNrPvJ3NVEB3njzKMv8JOA1OG/pub?output=csv';
                const response = await axios.get(csvUrl);

                // Парсинг CSV в массив объектов
                Papa.parse(response.data, {
                    header: true, // Используем первую строку как ключи
                    complete: (result) => {
                        const parsedData = result.data.map(row => ({
                            Word: row.Word,
                            Translation: row.Translation,
                            Example: row.Example,
                            PartOfSpeech: row['Part of speech'], // Обрабатываем пробел в названии
                            Theme: row.Theme,
                        }));
                        setTableData(parsedData); // Сохраняем в состояние
                        setLoading(false);
                    },
                    skipEmptyLines: true, // Пропускаем пустые строки
                });
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div>
            <h1>Данные из таблицы</h1>
            <table>
                <thead>
                    <tr>
                        <th>Word</th>
                        <th>Translation</th>
                        <th>Example</th>
                        <th>Part of speech</th>
                        <th>Theme</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Word}</td>
                            <td>{item.Translation}</td>
                            <td>{item.Example}</td>
                            <td>{item.PartOfSpeech}</td>
                            <td>{item.Theme}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SpreadsheetParser;