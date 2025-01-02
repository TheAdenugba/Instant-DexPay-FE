import { getMinute, getSeconds } from '@/utils';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Props {
    initCount: number;
}

const ConfirmTimer = ({ initCount }: Props) => {
    const [counter, setCounter] = useState(initCount || 0);

    useEffect(() => {
        if (initCount > 0) {
            setCounter(initCount); // Update `counter` only when `initCount` is valid
        }
    }, [initCount]);

    // Countdown logic
    useEffect(() => {
        if (counter <= 0) return; // Stop the timer if counter reaches zero

        const timer = setInterval(() => {
            setCounter((prev) => Math.max(prev - 1, 0)); // Prevent negative values
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on unmount
    }, [counter]); // Depend only on `counter`

    return (
        <Typography
            textAlign="right"
            fontWeight="bold"
            color="#fff"
            fontSize="18px"
        >
            {counter > 0 ? (
                <>
                    {getMinute(counter)}:{getSeconds(counter)}
                </>
            ) : (
                'Time has elapsed'
            )}
        </Typography>
    );
};

export default ConfirmTimer;
