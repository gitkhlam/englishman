export default function SettingsWindow ({
    theme,
    setTheme,
    setSettingsVisible,
    settingsVisible,
    resetAll,
    sound,
    setSound,
    showApiExamples,
    setShowApiExamples,
    googleSpread,
    setGoogleSpread,
    googleLink,
    setGoogleLink
}) {
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setSettingsVisible(false);
        }
    };

    // to prevent scrolling bottom window
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const [showGoogleSettings, setShowGoogleSettings] = useState(false); // state to show/hide google settings
    const [inputLink, setInputLink] = useState(""); // state for input link
    const [loading, setLoading] = useState(false); // state for loading sheet to check

    const handleAddLinkButton = async () => {

        if (inputLink !== "") {
            const rightData = await loadData();

            if (rightData) {
                setGoogleLink(inputLink);
                localStorage.setItem("googleLink", inputLink);
            } else alert("Something went wrong. Try to check your Google sheet and link.")
        }
        setInputLink("");
    }

    async function loadData() {
        try {
            setLoading(true);
            const data = await SpreadsheetParser(inputLink);
            setLoading(false);
            alert(data.length)
            return data !== null && data.length > 0;
        } catch (error) {
            console.log("Failed to load data. Please try again later.");
            setLoading(false);
            return false;
        }
    }

    const [openAcc, setOpenAcc] = useState(false);

    return (
        <div
            className="fixed z-51 inset-0 flex flex-col min-w-[320px] backdrop-blur-xs overflow-auto"
        >
            {
                loading &&
                <div className='fixed inset-0 w-[100dvw] h-[100dvh] bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] flex items-center justify-center z-99 text-5xl font-bold'>
                    Loading...⏳
                </div>
            }
            <MemoHeaderSection
                settingsVisible={!settingsVisible}
                theme={theme}
                setTheme={setTheme}
                setSettingsVisible={setSettingsVisible}
                logoClick={(e) => {
                    e.stopPropagation();
                    resetAll();
                }}
                onClick={(e) => e.stopPropagation()}
            >
                EnglishMan
            </MemoHeaderSection>
            <div
                className="grow-1 flex flex-col gap-5 justify-center items-center w-full container pb-5"
                onClick={handleBackgroundClick}
            >
                {!showGoogleSettings &&
                    <>
                        <button
                            className="buttonStyle text-4xl font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSound((prev) => { localStorage.setItem('soundStatus', `${!prev}`); return !prev; });
                            }}
                        >
                            {sound ? "Sound ENABLED 🔊" : "Sound DISABLED 🔇"}
                        </button>
                        <button
                            className="buttonStyle text-4xl sm:text-4xl font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowApiExamples((prev) => !prev);
                            }}
                        >
                            {showApiExamples
                                ? "Examples from API ENABLED ✅"
                                : "Examples from API DISABLED ❌"
                            }
                        </button>
                        <button
                            className="buttonStyle text-4xl sm:text-4xl font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowGoogleSettings(true);
                            }}
                        >
                            {googleLink ? "Edit Google Sheet📄" : "Add Google Sheet📄"}
                        </button>
                        {googleLink && <button
                            className="buttonStyle text-4xl sm:text-4xl font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                setGoogleSpread((prev) => { localStorage.setItem("googleSpread", `${!prev}`); return !prev })

                            }}
                        >
                            {googleSpread
                                ? "Current data: Google Sheet📄"
                                : "Current data: Default🗂️"
                            }
                        </button>}
                    </>
                }
                {
                    showGoogleSettings &&
                    <div className='rounded-lg dark:bg-[var(--light)] text-[var(--light)] border bg-[var(--dark)] dark:text-[var(--dark)] p-5 sm:max-w-3xl' >
                        <span className=' font-semibold text-2xl sm:text-3xl'>
                            Если вы хотите изучать свои слова, можно использовать Google Таблицы.
                        </span>
                        <div className="my-3 border rounded-lg shadow-md overflow-hidden duration-300 ease-in-out">
                            <button
                                className="w-full flex justify-between items-center p-2 transition duration-300 ease-in-out"
                                onClick={() => setOpenAcc(prev => !prev)}
                            >
                                <span className="font-bold text-xl">Инструкция!</span>
                                <ChevronDown
                                    className={`duration-300 ease-in-out transform transition-transform ${openAcc ? "rotate-180" : "rotate-0"}`}
                                />
                            </button>
                            {openAcc && (
                                <div className="p-4 border-t text-[var(--light)] dark:text-gray-700">
                                    <ul className='text-xl'>
                                        <li>
                                            1. Создайте новый документ в Google Sheets.
                                        </li>
                                        <li>
                                            2. В первой строке укажите названия колонок: Word, Translation, Example, Part of speech, Theme (ВАЖНО! Названия должны совпадать).
                                        </li>
                                        <li>
                                            3. Заполните таблицу своими данными:
                                            <ul className='list-disc pl-4'>
                                                <li>
                                                    Word и Translation — обязательные поля, они не могут быть пустыми.
                                                </li>
                                                <li>
                                                    Part of speech должно содержать одно из следующих значений: NOUN, PRONOUN, VERB,ADJECTIVE, ADVERB, PREPOSITION, CONJUNCTION, INTERJECTION.
                                                </li>
                                                <li>
                                                    Example — если у слова несколько примеров, разделяйте их знаком "+", например: go to bed + go on foot.
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            4. Опубликуйте таблицу в формате CSV: Файл → Опубликовать в интернете → CSV.
                                        </li>
                                        <li>
                                            5. Скопируйте полученную ссылку и вставьте её в соответствующее поле на сайте Englishman.
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <span className='text-xl font-bold'>ВАЖНО! Если данные в Google Sheet обновились, нужно подождать несколько минут, чтобы подтягивало новые данные.</span>
                        {
                            googleLink !== null &&
                            <div className='mt-5 text-xl font-medium underline'>
                                <a href={googleLink}>Current sheet</a>
                            </div>
                        }
                        <div className='mt-3'>
                            <p className='text-xl font-bold'>Paste your link</p>
                            <div className='mt-2 flex items-center gap-2'>
                                <input
                                    type="text"
                                    placeholder='google sheet link..'
                                    className='border rounded-lg px-2 py-1'
                                    value={inputLink}
                                    onChange={(e) => setInputLink(e.target.value)}
                                />
                                <button
                                    className='select-none text-xl font-semibold border py-1 px-2 rounded-lg cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] hover:opacity-50'
                                    onClick={() => handleAddLinkButton()}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
};
