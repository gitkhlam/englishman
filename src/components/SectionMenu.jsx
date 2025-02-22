

export default function SectionMenu() {
    return (
        <section className='container'>
            <div className="mx-auto p-6 flex flex-col space-y-4 justify-center items-center">
                {!inputMode && (
                    <h1 className="text-2xl sm:text-3xl font-semibold dark:text-[var(--light)] text-[var(--dark)] text-center mb-5">
                        Hello! Glad to welcome you to EnglishMan! <br />
                        Start learning new words right now!
                    </h1>
                )}
                <div className="flex justify-center gap-5">
                    {["manual", "choice"].map(mode => (
                        <MemoModeButton
                            key={mode}
                            onClick={() => handleClickMode(mode)}
                            isActive={inputMode === mode}
                        >
                            {mode === "manual" ? "Manual Type" : "Choice Mode"}
                        </MemoModeButton>
                    ))}
                </div>
                {inputMode && uniqueParts.length > 1 && (
                    <FilterControls
                        parts={uniqueParts}
                        themes={themeArray}
                        onPartChange={(e) => {
                            setSelectedPart(e.target.value);
                            setSelectedTheme("all");
                        }}
                        onThemeChange={(e) => setSelectedTheme(e.target.value)}
                    />
                )}
            </div>
        </section>
    )
}