import { useTranslation } from "react-i18next";
import { getTranslation } from '../langConfig';

export default function ThemesDropdown({ label, value, options, onChange, isTheme }) {
    const selectStyle = "flex-1 max-w-full min-w-25 truncate cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] p-1 rounded-lg outline-none hover:opacity-70 text-xl sm:text-2xl";
    const { t } = useTranslation(); // for language
    
    return (
        <div className="flex gap-2 font-medium flex-nowrap items-center">
            <p className='text-xl sm:text-2xl'>{label}</p>
            <select className={`${selectStyle}`}
                value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="all">{t("all")}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{isTheme ? getTranslation(opt, -1, "theme") : t(opt)}</option>
                ))}
            </select>
        </div>
    );
}