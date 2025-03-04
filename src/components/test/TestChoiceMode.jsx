export default function TestChoiceMode({ randomFourWords, processChoice, currentItem, setSound, sound, workArray }) {
    return (
        <>
            <div className="mt-5 flex gap-4 flex-wrap justify-around sm:justify-start items-center">
                {randomFourWords.map((word, ind) => (
                    <button
                        key={ind}
                        className="buttonStyle flex-grow"
                        onClick={() => processChoice(word.word)}
                    >
                        {word.word}
                    </button>
                ))}
            </div>
            <div className='mt-7 flex gap-5 items-center justify-center'>
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
        </>
    )
}
