"use client";
import React from "react";
import SwapToken from "@/components/instantBuy/SwapToken";
import { useRouter } from "next/navigation";


const CryptoExchange = () => {
    const router = useRouter()

    const handleClick = () => {
        router.push('/review')
    }
    return (
        <section className="flex justify-center">
            <SwapToken handleClick={handleClick} />
        </section>
    );
};

export default CryptoExchange;
