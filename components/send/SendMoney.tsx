'use Client'
import React, { useState } from 'react'
import Email from '@/app/assets/icons/email'
import Google from '@/app/assets/icons/google'
import Sync from '@/app/assets/icons/sync'
import { Button } from '@mui/material'
import AppInput from '../AppInput'
import SwapIcon from "@/app/assets/icons/swap";
import AppText from '../AppText'

type Props = {
    handleClick: () => void
}
const SendMoney = ({ handleClick }: Props) => {
    const [currency, setCurrency] = useState("NGN");
    const [amount, setAmount] = useState('');

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };
    const currencyOptions = ["NGN", "USD", "EUR"];

    return (
        <div className="p-6 rounded-lg w-[30%] bg-gray-900">
            <div className='flex space-x-4 justify-between mb-6'>
                <AppText text='Send Money' className='font-semibold' />
            </div>

            <div className="w-full">
                <AppInput
                    label="Amount to send"
                    amount={amount}
                    onAmountChange={handleAmountChange}
                    currency={currency}
                    setCurrency={setCurrency}
                    currencyOptions={currencyOptions}
                    extraLabel='Balance: 500.00 USDT'
                />

                <div className="mt-2 mb-8 text-xs text-white flex justify-between items-center">
                    <div className='flex items-center'>
                        <span>1.00 USDT = ₦1,498.00</span>
                        <Sync className="ml-2 mr-1" />
                        <span>Est. fee: $1.90</span>
                    </div>
                    <AppText text='Network: BEP20' />
                </div>

                <AppInput
                    label="Recipient receives"
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

            <div className='flex justify-center mt-8'>
                <AppText className='text-gray-600 text-lg' text={`© ${new Date().getFullYear()} Powered by DexPay`} />
            </div>
        </div>
    )
}

export default SendMoney