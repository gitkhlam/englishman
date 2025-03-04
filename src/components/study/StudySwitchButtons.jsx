export default function StudySwitchButtons({ currentItem, workArray, speak, sound, setCurrentItem, setSound, setWorkMode }) {

    // function processes click on next/prev button in study mode
    const handleSwitchButton = (nav) => {
        let current;
        if (nav === "next") {
            current = currentItem + 1 >= workArray.length ? currentItem : currentItem + 1;
        } else {
            current = currentItem - 1 <= 0 ? 0 : currentItem - 1
        }
        sound && speak(workArray[current].word); // if sound enable speak
        setCurrentItem(current);
    };

    return (
        <>
            <div className="flex justify-center items-center mt-2 gap-5 border-t pt-4">
                <button
                    className="buttonStyle"
                    disabled={currentItem === 0}
                    onClick={() => handleSwitchButton("prev")}
                >
                    prev
                </button>
                <p>
                    {currentItem + 1}/{workArray.length}
                </p>
                <button
                    className="buttonStyle"
                    disabled={currentItem === workArray.length - 1}
                    onClick={() => handleSwitchButton("next")}
                >
                    next
                </button>
            </div>

            <div className='w-full flex justify-center'>
                <span
                    className='cursor-pointer hover:opacity-70'
                    onClick={() => { setSound(prev => !prev) }}
                >
                    {sound ? "🔊" : "🔇"}
                </span>
            </div>

            {currentItem === workArray.length - 1 && (
                <div className="mt-4 flex justify-center">
                    <button
                        className="buttonStyle"
                        onClick={() => {
                            setCurrentItem(0);
                            setWorkMode("test");
                        }}
                    >
                        Start test
                    </button>
                </div>
            )}
        </>
    )
}