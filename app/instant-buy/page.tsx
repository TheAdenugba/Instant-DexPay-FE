"use client";
import React, { useState } from "react";
import ReviewBuyTrade from "@/components/instantBuy/ReviewBuyTrade";
import SwapToken from "@/components/instantBuy/SwapToken";

enum FLOW {
    SWAP = 'swap',
    REVIEW = 'review'
}
const CryptoExchange = () => {

    const [flow, setFlow] = useState(FLOW.SWAP)
    const handleClick = () => {
        setFlow(FLOW.REVIEW)
    }

    const p2pFlow = {
        [FLOW.SWAP]: <SwapToken handleClick={handleClick} />,
        [FLOW.REVIEW]: <ReviewBuyTrade handleClick={() => setFlow(FLOW.SWAP)} />
    }

    return (
        <section className="flex justify-center">
            {p2pFlow[flow]}
        </section>
    );
};

export default CryptoExchange;
