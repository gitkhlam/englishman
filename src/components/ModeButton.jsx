export default function ModeButton({ onClick, children, isActive }) {
    const colors = {
        bgColDark: "bg-[var(--bg-col-dark)]",
        textColDark: "text-[var(--text-col-dark)]",
        bgColLight: "bg-[var(--bg-col-light)]",
        textColLight: "text-[var(--text-col-light)]"
    };
            
    const activeClasses = `${colors.bgColDark} ${colors.textColDark} dark:${colors.bgColLight} dark:${colors.textColLight}`;
    const inactiveClasses = `bg-transparent ${colors.textColLight} dark:${colors.textColDark} hover:${colors.bgColDark} hover:${colors.textColDark} dark:hover:${colors.bgColLight} dark:hover:${colors.textColLight}`;
    
    return (
        <button
            onClick={onClick}
            className={`px-2 py-1 text-xl font-medium rounded-lg transition duration-500 cursor-pointer ${isActive ? activeClasses : inactiveClasses}`}
        
        >
            {children}
        </button>
    );
}