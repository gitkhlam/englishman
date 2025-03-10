import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
    .use(HttpApi)
    .use(LanguageDetector) 
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true, 
        interpolation: { escapeValue: false },
        resources: {
            en: {
                translation: {
                    welcome: "Welcome to our website!",
                    change_language: "Change Language",
                    logo: "EnglishMan",
                    hello_text: " Hello! Glad to welcome you to EnglishMan! Start learning new words right now!",
                    sound_enabled: "Sound ENABLED 🔊",
                    sound_disabled: "Sound DISABLED 🔇",
                    language_menu: "Language:",
                    api_examples_enabled: 'Examples from API ENABLED ✅',
                    api_examples_disabled: 'Examples from API DISABLED ❌',
                    edit_gs: 'Edit Google Sheet📄',
                    add_gs: 'Add Google Sheet📄',
                    current_data_gs: 'Current data: Google Sheet📄',
                    current_data_default: 'Current data: Default🗂️',
                    mistakes_list: 'List of mistakes 🗿',
                    loading: 'Loading...⏳',
                    settings: 'settings',
                    study_mode: 'Study Mode 📚',
                    test_mode: 'Test Mode 📝',
                    english: 'English',
                    russian: 'Russian',
                    ukrainian: "Ukrainian",
                    404: 'Page not found',
                    mistake_test_mode: "Mistake test mode",
                    test_mode2: "Test mode ✍️",
                    choose_test_mode: "Choose test mode:",
                    manual: "Manual",
                    choice: "Choice",
                    manual_mode: "Manual Type",
                    choice_mode: "Choice Mode",
                    mistake_word_test: "Mistake words test",
                    choose_part_of_speech: "Choose part of speech:",
                    choose_theme: "Choose theme:",
                    check: "Check",
                    placeholder: 'Enter a word and press "Enter"',
                    word: "Word",
                    translation: "Translation",
                    loading_examples: "Loading examples...⏳",
                    examples: "Examples...",
                    example: "Example",
                    start_test: "Start test",
                    next: "next",
                    prev: "prev",
                    mistake_list_header: "This is your list of mistakes:",
                    you_have: "You have",
                    weak: "weak",
                    words: "words",
                    part_of_speech: "Part of speech",
                    google_settings_hello: 'If you want to study your words, you can use Google Sheets.',
                    instruction: 'Instruction',
                    important_google: "IMPORTANT! If the data in Google Sheet has been updated, you need to wait a few minutes for the new data to be pulled.",
                    cur_link: "Current link",
                    paste_link: "Paste the link to Google Sheet",
                    add: "Add",
                    instruction_list_1: "1. Create a new document in Google Sheets.",
                    instruction_list_2: "2. In the first row, specify the column names: Word, Translation, Example, Part of speech, Theme (IMPORTANT! Names must match).",
                    instruction_list_3: "3. Fill in the table with your data:",
                    instruction_list_3_1: "Word and Translation — required fields, they cannot be empty.",
                    instruction_list_3_2: "Part of speech must contain one of the following values: NOUN, PRONOUN, VERB, ADJECTIVE, ADVERB, PREPOSITION, CONJUNCTION, INTERJECTION.",
                    instruction_list_3_3: "Example — if the word has several examples, separate them with a '+', for example: go to bed + go on foot.",
                    instruction_list_4: "4. Publish the table in CSV format: File → Publish to the web → CSV.",
                    instruction_list_5: "5. Copy the received link and paste it into the appropriate field on the Englishman website.",
                    close: "Close",
                    result_1: "Excellent! You have reached perfection! 🎉🏆",
                    result_2: "Great result! A little more, and you're at the top! 🚀",
                    result_3: "Well done! You are on the right track! 🔥",
                    result_4: "Not bad, but there is room for improvement! Onward to new victories! 💪",
                    result_5: "Don't give up! Every step brings you closer to your goal! ✨",
                    result_6: "Not the best result 😞, but don't give up! Keep moving forward! 💪",
                    your_score: "Your score:",
                    you_got: "You got",
                    out_of: "out of",
                    words_correct: "words correct",
                    wrong_answer: "Wrong",
                    correct_answer: "Correct",
                },
            },
            ru: {
                translation: {
                    logo: "ИнглишМен",
                    welcome: "Добро пожаловать на наш сайт!",
                    change_language: "Сменить язык",
                    hello_text: "Добро пожаловать! Рады приветствовать вас на EnglishMan! Начните учить новые слова прямо сейчас!",
                    sound_enabled: "Звук ВКЛЮЧЕН 🔊",
                    sound_disabled: "Звук ВЫКЛЮЧЕН 🔇",
                    language_menu: "Язык:",
                    api_examples_enabled: 'Примеры с API ВКЛЮЧЕНЫ ✅',
                    api_examples_disabled: 'Примеры с API ВЫКЛЮЧЕНЫ ❌',
                    edit_gs: 'Изменить Google Sheet📄',
                    add_gs: 'Добавить Google Sheet📄',
                    current_data_gs: 'Текущие данные: Google Sheet📄',
                    current_data_default: 'Текущие данные: По умолчанию🗂️',
                    mistakes_list: 'Список ошибок 🗿',
                    loading: 'Загрузка...⏳',
                    settings: 'настройки',
                    study_mode: 'Режим учёбы 📚',
                    test_mode: 'Режим теста 📝',
                    english: 'Английский',
                    russian: 'Русский',
                    ukrainian: "Украинский",
                    404: 'Страница не найдена',
                    mistake_test_mode: "Режим теста с ошибками",
                    test_mode2: "Режим теста ✍️",
                    choose_test_mode: "Выберите режим теста",
                    manual: "Ручной",
                    choice: "Выбор",
                    manual_mode: "Ручной ввод",
                    choice_mode: "Режим выбора",
                    mistake_word_test: "Тест на ошибочные слова",
                    choose_part_of_speech: "Выберите часть речи:",
                    choose_theme: "Выберите тему:",
                    check: "Проверить",
                    placeholder: 'Введите слово и нажмите "Enter"',
                    word: "Слово",
                    translation: "Перевод",
                    loading_examples: "Загрузка примеров...⏳",
                    examples: "Примеры...",
                    example: "Пример",
                    start_test: "Начать тест",
                    next: "след",
                    prev: "пред",
                    mistake_list_header: "Это ваш список ошибок:",
                    you_have: "У вас",
                    weak: "проблемных",
                    words: "слов(-а)",
                    part_of_speech: "Часть речи",
                    google_settings_hello: 'Если вы хотите изучать свои слова, можно использовать Google Таблицы.', 
                    instruction: 'Инструкция',
                    important_google: "ВАЖНО! Если данные в Google Sheet обновились, нужно подождать несколько минут, чтобы подтягивало новые данные.",
                    cur_link: "Текущая ссылка",
                    paste_link: "Вставьте ссылку на Google Sheet",
                    add: "Добавить",
                    instruction_list_1: "1. Создайте новый документ в Google Sheets.",
                    instruction_list_2: "2. В первой строке укажите названия колонок: Word, Translation, Example, Part of speech, Theme (ВАЖНО! Названия должны совпадать).",
                    instruction_list_3: "3. Заполните таблицу своими данными:",
                    instruction_list_3_1: "Word и Translation — обязательные поля, они не могут быть пустыми.",
                    instruction_list_3_2: "Part of speech должно содержать одно из следующих значений: NOUN, PRONOUN, VERB, ADJECTIVE, ADVERB, PREPOSITION, CONJUNCTION, INTERJECTION.",
                    instruction_list_3_3: "Example — если у слова несколько примеров, разделяйте их знаком '+', например: go to bed + go on foot.",
                    instruction_list_4: "4. Опубликуйте таблицу в формате CSV: Файл → Опубликовать в интернете → CSV.",
                    instruction_list_5: "5. Скопируйте полученную ссылку и вставьте её в соответствующее поле на сайте Englishman.",
                    close: "Закрыть",
                    result_1: "Превосходно! Ты достиг идеала! 🎉🏆",
                    result_2: "Отличный результат! Еще немного, и ты на вершине! 🚀",
                    result_3: "Молодец! Ты на правильном пути! 🔥",
                    result_4: "Неплохо, но есть куда стремиться! Вперед к новым победам! 💪",
                    result_5: "Не сдавайся! Каждый шаг приближает тебя к цели! ✨",
                    result_6: "Не лучший результат 😞, но не сдавайся! Продолжай двигаться вперед! 💪",
                    your_score: "Ваш результат:",
                    you_got: "Вы правильно ответили на",
                    out_of: "из",
                    words_correct: "слов",
                    wrong_answer: "Неверно",
                    correct_answer: "Верно",
                },
            },
            ua: {
                translation: {
                    logo: "ІнглішМен",
                    welcome: "Ласкаво просимо на наш сайт!",
                    change_language: "Змінити мову",
                    hello_text: "Ласкаво просимо! Раді вітати вас на EnglishMan! Почніть вивчати нові слова прямо зараз!",
                    sound_enabled: "Звук УВІМКНЕНО 🔊",
                    sound_disabled: "Звук ВИМКНЕНО 🔇",
                    language_menu: "Мова:",
                    api_examples_enabled: "Приклади з API УВІМКНЕНО ✅",
                    api_examples_disabled: "Приклади з API ВИМКНЕНО ❌",
                    edit_gs: "Змінити Google Sheet📄",
                    add_gs: "Додати Google Sheet📄",
                    current_data_gs: "Поточні дані: Google Sheet📄",
                    current_data_default: "Поточні дані: За замовчуванням🗂️",
                    mistakes_list: "Список помилок 🗿",
                    loading: "Завантаження...⏳",
                    settings: "Налаштування",
                    study_mode: "Режим навчання 📚",
                    test_mode: "Режим тесту 📝",
                    english: "Англійська",
                    russian: "Російська",
                    ukrainian: "Українська",
                    404: "Це шо це таке? Такої сторінки не знайдено!",
                    mistake_test_mode: "Режим тесту з помилками",
                    test_mode2: "Режим тесту ✍️",
                    choose_test_mode: "Оберіть режим тесту",
                    manual: "Ручний",
                    choice: "Вибір",
                    manual_mode: "Ручне введення",
                    choice_mode: "Режим вибору",
                    mistake_word_test: "Тест на помилкові слова",
                    choose_part_of_speech: "Оберіть частину мови:",
                    choose_theme: "Оберіть тему:",
                    check: "Перевірити",
                    placeholder: 'Введіть слово та натисніть "Enter"',
                    word: "Слово",
                    translation: "Переклад",
                    loading_examples: "Завантаження прикладів...⏳",
                    examples: "Приклади...",
                    example: "Приклад",
                    start_test: "Почати тест",
                    next: "наст",
                    prev: "попер",
                    mistake_list_header: "Це ваш список помилок:",
                    you_have: "У вас",
                    weak: "проблемних",
                    words: "слів(-а)",
                    part_of_speech: "Частина мови",
                    google_settings_hello: "Якщо ви хочете вивчати свої слова, можна використовувати Google Таблиці.",
                    instruction: "Інструкція",
                    important_google: "ВАЖЛИВО! Якщо дані в Google Sheet оновилися, потрібно почекати кілька хвилин, щоб підтягнулися нові дані.",
                    cur_link: "Поточне посилання",
                    paste_link: "Вставте посилання на Google Sheet",
                    add: "Додати",
                    instruction_list_1: "1. Створіть новий документ у Google Sheets.",
                    instruction_list_2: "2. У першому рядку вкажіть назви колонок: Word, Translation, Example, Part of speech, Theme (ВАЖЛИВО! Назви мають збігатися).",
                    instruction_list_3: "3. Заповніть таблицю своїми даними:",
                    instruction_list_3_1: "Word і Translation — обов'язкові поля, вони не можуть бути порожніми.",
                    instruction_list_3_2: "Part of speech має містити одне з таких значень: NOUN, PRONOUN, VERB, ADJECTIVE, ADVERB, PREPOSITION, CONJUNCTION, INTERJECTION.",
                    instruction_list_3_3: "Example — якщо у слова кілька прикладів, розділяйте їх знаком '+', наприклад: go to bed + go on foot.",
                    instruction_list_4: "4. Опублікуйте таблицю у форматі CSV: Файл → Опублікувати в Інтернеті → CSV.",
                    instruction_list_5: "5. Скопіюйте отримане посилання та вставте його у відповідне поле на сайті Englishman.",
                    close: "Закрити",
                    result_1: "Чудово! Ти досяг ідеалу! 🎉🏆",
                    result_2: "Відмінний результат! Ще трохи — і ти на вершині! 🚀",
                    result_3: "Молодець! Ти на правильному шляху! 🔥",
                    result_4: "Непогано, але є куди прагнути! Вперед до нових перемог! 💪",
                    result_5: "Не здавайся! Кожен крок наближає тебе до мети! ✨",
                    result_6: "Не найкращий результат 😞, але не здавайся! Продовжуй рухатися вперед! 💪",
                    your_score: "Ваш результат:",
                    you_got: "Ви правильно відповіли на",
                    out_of: "з",
                    words_correct: "слів",
                    wrong_answer: "Неправильно",
                    correct_answer: "Правильно",
                },
            },

        },
    });

export default i18n;
