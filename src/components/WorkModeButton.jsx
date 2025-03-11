// button for work mode and test mode

export default function ModeButton({ onClick, children, isActive }) {
        
    const activeClasses = `bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)]`;
    const inactiveClasses = `border border-[var(--dark)] dark:border-[var(--light)] bg-transparent text-[var(--dark)] dark:text-[var(--light)] hover:bg-[var(--dark)] hover:text-[var(--light)] dark:hover:bg-[var(--light)] dark:hover:text-[var(--dark)]`;
    
    return (
        <button
            onClick={onClick}
            className={`select-none px-4 py-2 text-3xl font-medium rounded-lg transition-all duration-500 cursor-pointer ${isActive ? activeClasses : inactiveClasses}`}
        
        >
            {children}
        </button>
    );
}