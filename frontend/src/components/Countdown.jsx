import React, { useState, useEffect } from 'react';

const Countdown = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!endTime) return setTimeLeft('Час не вказано');

        const timer = setInterval(() => {
            let targetTime = String(endTime).includes('T') ? new Date(endTime).getTime() : Number(endTime);
            const difference = targetTime - Date.now();
            
            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const mins = Math.floor((difference / (1000 * 60)) % 60);
                const secs = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${hours}г ${mins}хв ${secs}с`);
            } else {
                setTimeLeft('Торги завершено');
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    return <div style={{ color: 'var(--accent-blue)', fontSize: '14px', marginBottom: '10px' }}>До кінця: {timeLeft}</div>;
};

export default Countdown;