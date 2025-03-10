import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "../../langConfig.js";

export default function SettingsMenu({ sound, setSound, showApiExamples, setShowGoogleSettings, setShowApiExamples, setGoogleSpread, googleLink, googleSpread, wrongWords, setSettingsVisible, setMistakeTest }) {

    const navigate = useNavigate();
    
    const { t, i18n } = useTranslation();

    const toggleSound = (e) => {
        e.stopPropagation();
        setSound(prev => {
            localStorage.setItem('soundStatus', !prev);
            return !prev;
        });
    };

    const toggleApiExamples = (e) => {
        e.stopPropagation();
        setShowApiExamples(prev => !prev);
    };

    const toggleGoogleSpread = (e) => {
        e.stopPropagation();
        setGoogleSpread(prev => {
            localStorage.setItem('googleSpread', !prev);
            return !prev;
        });
    };

    const Button = ({ onClick, children, className = '' }) => (
        <button
            className={`buttonStyle !break-normal w-full sm:w-fit text-3xl sm:text-4xl font-bold ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );

    function handleLanguageChange(event) {
        const newLang = event.target.value;

        i18n.changeLanguage(newLang);
    }

    const languages = {
        en: t("english"),
        ru: t("russian"),
    };

    const selectStyle = " truncate cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] p-1 rounded-lg outline-none hover:opacity-70 text-2xl font-medium";

    return (
        <>
            <div className='flex justify-center w-full sm:w-fit bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] p-2 gap-2 rounded-lg'>
                <p className='text-3xl sm:text-4xl font-bold'>{t("language_menu")}</p>
                <select className={selectStyle} value={i18n.language} onChange={handleLanguageChange}>
                    {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                    ))}
                </select>
            </div>

            <Button onClick={toggleSound}>
                {sound ? t("sound_enabled") : t("sound_disabled")}
            </Button>

            <Button onClick={toggleApiExamples}>
                { showApiExamples
                    ? t("api_examples_enabled")
                    : t("api_examples_disabled") }
            </Button>

            <Button onClick={(e) => {
                e.stopPropagation();
                setSettingsVisible(false);
                navigate("/englishman/custom")
            }}>
                {googleLink ? t("edit_gs") : t("add_gs")}
            </Button>

            {googleLink && (
                <Button onClick={toggleGoogleSpread}>
                    { googleSpread
                        ? t("current_data_gs")
                        : t("current_data_default") }
                </Button>
            )}

            { wrongWords.length > 0 && 
                <Button onClick={(e) => {
                    e.stopPropagation();
                    setSettingsVisible(false);
                    setMistakeTest(false);
                    navigate("/englishman/mistakes")
                }}>
                    { t("mistakes_list") }
                </Button>
            }
        </>
    )
}