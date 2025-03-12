export default function TestChoiceMode({ fastAnimation, playSound, setFastAnimation, randomFourWords, processChoice, currentItem, setSound, sound, workArray }) {
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
                <p 
                    className={`cursor-pointer ${fastAnimation ? "underline" : ""}`}
                    onClick={() => { setFastAnimation(prev => !prev); playSound(import.meta.env.BASE_URL + "click.mp3") }}>
                    {currentItem + 1}/{workArray.length}
                </p>
                <span
                    className='cursor-pointer hover:opacity-70'
                    onClick={() => setSound(prev => {
                        localStorage.setItem('soundStatus', !prev);
                        return !prev;
                    })}
                >
                    {sound ? "🔊" : "🔇"}
                </span>
            </div>
        </>
    )
}
