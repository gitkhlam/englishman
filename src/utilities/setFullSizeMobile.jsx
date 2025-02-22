import { useState, useEffect } from 'react';


export default function setFullSizeMobile() {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    
    const handleResize = () => {
        setWindowHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerHeight]);

    return windowHeight;
};
