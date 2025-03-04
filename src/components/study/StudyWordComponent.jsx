import ExamplesComponent from './ExamplesComponent';

export default function StudyWordComponent({
    word,
    translation,
    defaultExampleArrayLength,
    speak,
    loadingSentences,
    showApiExamples,
    defaultExampleArray,
    apiExampleArrayLength,
    apiExampleArray
}) {

    const renderExamples = (condition, array, isApi) => (
        condition && (
            <ExamplesComponent
                exampleArray={array}
                speak={speak}
                isApi={isApi}
            />
        )
    );

    return (
        <div className="flex flex-col gap-3">
            <p className="break-words">
                Word:{" "}
                <span
                    className="cursor-pointer py-1 px-2 rounded-lg bg-[var(--dark)] text-[var(--light)] dark:bg-[var(--light)] dark:text-[var(--dark)] text-2xl font-semibold"
                    onClick={() => speak(word)}
                >
                    {word}
                </span>
            </p>
            <p className="break-words">
                Translation: <span className="text-2xl font-semibold">{translation}</span>
            </p>
            {loadingSentences ? <div>Loading examples... ⏳</div> :
                <div>
                    {renderExamples(!showApiExamples && defaultExampleArrayLength >= 1, defaultExampleArray, false)}
                    {renderExamples(apiExampleArrayLength > 0, apiExampleArray, true)}
                </div>
            }
        </div>
    )
}