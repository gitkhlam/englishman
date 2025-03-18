// function speak of word
export const speak = (word) => {
        window.speechSynthesis.cancel(); // if prev speech doesn't stop
        if (!word) return;
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.voice = window.speechSynthesis.getVoices().find(voice => (voice.name === "Samantha" || voice.name.includes("Google")) && voice.lang === "en-US");
        // speak
        window.speechSynthesis.speak(utterance);
    };


export const playSound = (src) => {
    const audio = new Audio(src);
    audio.currentTime = 0;
    audio.play();
};