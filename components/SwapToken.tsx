'use Client'
import React, { ChangeEvent, useState } from 'react'
import Email from '@/app/assets/icons/email'
import Google from '@/app/assets/icons/google'
import Sync from '@/app/assets/icons/sync'
import { Button } from '@mui/material'
import AppInput from './AppInput'
import SwapIcon from "@/app/assets/icons/swap";

type Props = {
    handleClick: () => void
}
const SwapToken = ({ handleClick }: Props) => {
    const [btnAction, setBtnAction] = useState<string | null>("Buy");
    const [currency, setCurrency] = useState("NGN");
    const [amount, setAmount] = useState('');

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };
    const currencyOptions = ["NGN", "USD", "EUR"];

    return (
        <div className="p-6 rounded-lg w-[30%] bg-gray-900">
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

            <div className="w-full mt-8">
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
                    <SwapIcon className="size-4 cursor-pointer" />
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
                <Button onClick={handleClick} fullWidth className="bg-white rounded-xl text-black capitalize">
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
    )
}

export default SwapToken