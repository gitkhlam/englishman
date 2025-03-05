
export default function SettingsMenu({ sound, setSound, showApiExamples, setShowGoogleSettings, setShowApiExamples, setGoogleSpread, googleLink, googleSpread }) {

    const toggleSound = (e) => {
        e.stopPropagation();
        setSound(prev => {
            localStorage.setItem('soundStatus', !prev);
            return !prev;
        });
    };

    const toggleApiExamples = (e) => {
        e.stopPropagation();
        setShowApiExamples(prev => !prev);
    };

    const toggleGoogleSpread = (e) => {
        e.stopPropagation();
        setGoogleSpread(prev => {
            localStorage.setItem('googleSpread', !prev);
            return !prev;
        });
    };

    const Button = ({ onClick, children, className = '' }) => (
        <button
            className={`buttonStyle !break-normal w-full sm:w-fit text-3xl sm:text-4xl font-bold ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );

    return (
        <>
            <Button onClick={toggleSound}>
                {sound ? 'Sound ENABLED 🔊' : 'Sound DISABLED 🔇'}
            </Button>

            <Button onClick={toggleApiExamples}>
                {showApiExamples
                    ? 'Examples from API ENABLED ✅'
                    : 'Examples from API DISABLED ❌'}
            </Button>

            <Button onClick={(e) => {
                e.stopPropagation();
                setShowGoogleSettings(true);
            }}>
                {googleLink ? 'Edit Google Sheet📄' : 'Add Google Sheet📄'}
            </Button>

            {googleLink && (
                <Button onClick={toggleGoogleSpread}>
                    {googleSpread
                        ? 'Current data: Google Sheet📄'
                        : 'Current data: Default🗂️'}
                </Button>
            )}
        </>
    )
}