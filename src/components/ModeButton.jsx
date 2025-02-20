export default function ModeButton({ onClick, children, isActive }) {
    
        
    const activeClasses = `bg-[var(--bg-col-dark)] text-[var(--text-col-dark)] dark:bg-[var(--bg-col-light)] dark:text-[var(--text-col-light)]`;
    const inactiveClasses = `bg-transparent text-[var(--text-col-light)] dark:text-[var(--text-col-dark)] hover:bg-[var(--bg-col-dark)] hover:text-[var(--text-col-dark)] dark:hover:bg-[var(--bg-col-light)] dark:hover:text-[var(--text-col-light)]`;
    
    return (
        <button
            onClick={onClick}
            className={`px-2 py-1 text-xl font-medium rounded-lg transition duration-500 cursor-pointer ${isActive ? activeClasses : inactiveClasses}`}
        
        >
            {children}
        </button>
    );
}