export default function ThemesDropdown({ label, value, options, onChange }) {
    return (
        <div className="flex gap-2 font-medium flex-nowrap items-center">
            <p>{label}</p>
            <select className="flex-1 max-w-full min-w-25 truncate cursor-pointer bg-[var(--light)] text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)] p-1 rounded-lg outline-none hover:opacity-70"
                value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="all">all</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}