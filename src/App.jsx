import React from "react";
import Header from './components/Header';
import { CogIcon } from '@heroicons/react/24/solid';
import ModeButton from './components/ModeButton';
import { useState } from 'react';

export default function App() {
    const [mode, setMode] = useState(null);
    const resetAll = () => {
        setMode(null)
    }
    return (
        <div className='flex flex-col min-h-screen'>
            <Header>EnglishMan</Header>
            <main className='flex flex-col items-center justify-center mt-[-100px] flex-grow'>
                <section className='py-12 container  '>
                    <div className="mx-auto p-6 flex flex-col space-y-4 justify-center items-center">
                        { mode === null && (
                        <>
                                <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--text-col-dark)] text-[var(--text-col-light)] text-center">Hello! Glad to welcome you to EnglishMan! <br /> Start learning new words right now!</h1>
                                <span className="text-[var(--text-col-light)] dark:text-[var(--text-col-dark)] text-2xl font-medium mt-10 mb-4">Choose mode:</span>
                        </>
                        )}
                        <div className="flex justify-center gap-5">
                            <ModeButton onClick={() => setMode('manual')} isActive={mode === 'manual'}>Manual Type</ModeButton>
                            <ModeButton onClick={() => setMode('choice')} isActive={mode === 'choice'}>Choice Mode</ModeButton>
                        </div>
                        
                    </div>
                </section>
            </main>    
            <footer className="text-[var(--text-col-light)] dark:text-[var(--text-col-dark)] text-s p-5 w-full text-center font-semibold">Kyiv 2025</footer>
        </div>
    );
}


