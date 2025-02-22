export default function ModeButton({ onClick, children, isActive }) {
    
        
    const activeClasses = `bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)]`;
    const inactiveClasses = `bg-transparent text-[var(--dark)] dark:text-[var(--light)] hover:bg-[var(--dark)] hover:text-[var(--light)] dark:hover:bg-[var(--light)] dark:hover:text-[var(--dark)]`;
    
    return (
        <button
            onClick={onClick}
            className={`px-2 py-1 text-2xl font-medium rounded-lg transition duration-500 cursor-pointer ${isActive ? activeClasses : inactiveClasses}`}
        
        >
            {children}
        </button>
    );
}