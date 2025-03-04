export default function TestManualMode({ input, setInput, processChoice, currentItem, workArray, setSound, sound }) {
    return (
        <div>
            <input
                className="my-4 w-full border py-3 px-5 rounded-lg border-[var(--dark)] dark:border-[var(--light)] outline-blue-300"
                type="text"
                value={input}
                placeholder="Type translation and press 'Enter'"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && processChoice(input)}
            />
            <div className="flex items-center gap-5">
                <button className="buttonStyle" onClick={() => processChoice(input)}>
                    Check
                </button>
                <p>
                    {currentItem + 1}/{workArray.length}
                </p>
                <span
                    className='cursor-pointer hover:opacity-70'
                    onClick={() => setSound(prev => !prev)}
                >
                    {sound ? "🔊" : "🔇"}
                </span>
            </div>
        </div>
    )
}