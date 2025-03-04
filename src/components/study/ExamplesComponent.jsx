import { useState } from 'react';

export default function ExamplesComponent({ exampleArray, speak, isApi }) {
    const [accordionOpen, setAccordionOpen] = useState(false);

    return (
        <div className="break-words transition-all duration-300 ease-in-out">
            <button
                className="cursor-pointer bg-[var(--dark)] dark:bg-[var(--light)] text-[var(--light)] dark:text-[var(--dark)] font-medium p-2 rounded-lg"
                onClick={() => setAccordionOpen(prev => !prev)}
            >
                {exampleArray.length > 1 ? `${isApi ? "API" : ""} Examples.. ${accordionOpen ? "👇" : "👈"}` : `${isApi ? "API" : ""} Example ${accordionOpen ? "👇" : "👈"}`}
            </button>

            <ul
                className={`transition-all duration-300 ease-in-out ${accordionOpen ? "mt-3 opacity-100 max-h-full" : "opacity-0 max-h-0 overflow-hidden"}`}
            >
                {exampleArray.map((example, index) => (
                    <li
                        className="cursor-pointer text-2xl font-semibold"
                        onClick={() => speak(example)}
                        key={index}
                    >
                        {`${exampleArray.length > 1 ? index + 1 + ". " : ""}` + example}
                    </li>
                ))}
            </ul>
        </div>
    )
}