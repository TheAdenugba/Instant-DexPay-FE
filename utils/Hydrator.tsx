/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useRef } from 'react'
import { useAccount } from 'wagmi';
import { io } from "socket.io-client";
import { updateSocket } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/hooks';


const Hydrator = () => {
    const { address } = useAccount();
    const dispatch = useAppDispatch();
    const audioPlayer = useRef<HTMLAudioElement>(null);

    const playAudio = () => {
        if (audioPlayer.current != null) audioPlayer.current.play();
    };


    const socket = io(process.env.NEXT_PUBLIC_BASE_URL || "", {
        autoConnect: false,
        transports: ["websocket"],
        query: {
            address: address || "",
        },
    });


    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
            dispatch(updateSocket(socket));
        }
    }, [address]);

    useEffect(() => {
        socket.on("New notification", (data: any) => {
            if (data) {
                /* console.log(
                  "see new notification >>>>>>: " + JSON.stringify(data.payload)
                ); */
                playAudio();
            }
        });
    }, [socket]);
    return (
        <>
            {/* <Component {...pageProps} /> */}
            <audio ref={audioPlayer} src="/notification-sound.mp3" />
        </>
    )
}

export default Hydrator