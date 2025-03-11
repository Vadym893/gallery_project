import { useState, useEffect, useRef } from "react";

export function useActivityTracker(inactivityTime = 30 * 60 * 1000) { 
    const [isActive, setIsActive] = useState(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const resetTimer = () => {
            clearTimeout(timeoutRef.current);
            setIsActive(true);
            timeoutRef.current = setTimeout(() => {
                setIsActive(false); 
            }, inactivityTime);
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);

        resetTimer(); 

        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);
            clearTimeout(timeoutRef.current);
        };
    }, [inactivityTime]);

    return isActive;
}