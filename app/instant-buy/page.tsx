"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";
import Google from "../assets/icons/google";
import Email from "../assets/icons/email";
import Swap from "../assets/icons/swap";
import Sync from "../assets/icons/sync";
import AppInput from "@/components/AppInput";

const CryptoExchange = () => {
    const [btnAction, setBtnAction] = useState<string | null>("Buy");
    const [currency, setCurrency] = useState("NGN");
    const [amount, setAmount] = useState(0);

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };
    const currencyOptions = ["NGN", "USD", "EUR"];

    return (
        <section className="flex justify-center">
            <div className="p-6 rounded-lg w-[30%] bg-gray-800">
                <div className="flex mb-4 bg-[#262f3d] p-2 rounded-xl space-x-2">
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className={`${btnAction === "Buy" ? "bg-gray-700" : "text-gray-400"}`}
                        onClick={() => setBtnAction("Buy")}
                    >
                        Buy
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className={`${btnAction === "Sell" ? "bg-gray-700" : "text-gray-400"}`}
                        onClick={() => setBtnAction("Sell")}
                    >
                        Sell
                    </Button>
                </div>

                <div className="w-full">
                    <AppInput
                        label="Amount to buy"
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        currency={currency}
                        setCurrency={setCurrency}
                        currencyOptions={currencyOptions}
                    />

                    <div className="mt-2 text-sm text-white flex items-center">
                        <span>1.00 USDT = ₦1,498.00</span>
                        <Sync className="ml-2 mr-1" />
                        <span>Est. fee: $1.90</span>
                    </div>

                    <div className="flex justify-center my-4">
                        <Swap className="size-4 cursor-pointer" />
                    </div>

                    <AppInput
                        label="Amount to receive"
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        currency={currency}
                        setCurrency={setCurrency}
                        currencyOptions={currencyOptions}
                    />
                </div>

                <div className="flex flex-col items-center space-y-3 mt-8">
                    <Button fullWidth className="bg-white rounded-xl text-black capitalize">
                        Connect Wallet
                    </Button>
                    <section className="flex space-x-4 w-full">
                        <Button
                            variant="outlined"
                            fullWidth
                            className="bg-gray-700 outline-gray-700 rounded-lg text-white capitalize w-full"
                        >
                            <Google className="mr-2" />
                            Continue with Google
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            className="text-white bg-gray-700 rounded-lg outline-gray-700 capitalize w-full"
                        >
                            <Email className="mr-2" /> Continue with email
                        </Button>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default CryptoExchange;
