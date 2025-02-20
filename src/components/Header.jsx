import SwitchColorModeButton from './SwitchColorModeButton';
import { CogIcon } from '@heroicons/react/24/solid';

export default function Header({children}) {
    return(
        <>
            <header className=' fixed top-0 left-0 w-full z-10 bg-[rgba(10, 10, 10, 0.8)] backdrop-blur-lg border-white/10'>
                {/* <div>&#8203;</div> Лютый костыль чтобы работали paddings: в первом элементе в body не будет корректно работать курсор, если есть padding. */}

                <div className="flex justify-between items-center container py-6 gap-x-4">
                    <span className="text-4xl font-bold text-[var(--text-col-light)] dark:text-[var(--text-col-dark)] !cursor-pointer break-all inline-block transition-all duration-500 hover:translate-x-[1px] hover:translate-y-[1px] hover:[text-shadow:2px_2px_5px_rgba(213,213,213,0.3)] hover:scale-108">
                        {children}
                    </span>

                    <div className="flex items-center space-x-4">
                        <SwitchColorModeButton />
                        <button
                            className='cursor-pointer hover:opacity-30 transition-all duration-[var(--transition-colors-dark-light)] transform-gpu hover:rotate-[360deg] hover:scale-110'
                            onClick={() => alert('Settings')}
                        >
                            <CogIcon className="w-12 h-12 dark:text-blue-100 text-[var(--text-col-light)] cursor-pointer" />
                        </button>
                    </div>
                </div>
            </header>

        </>
    )
}