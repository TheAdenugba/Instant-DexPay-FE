"use client";
import React, { useState } from "react";
import { Button, Select, MenuItem } from "@mui/material";
import Google from "../assets/icons/google";
import Email from "../assets/icons/email";
import Swap from "../assets/icons/swap";
import Sync from "../assets/icons/sync";

const CryptoExchange = () => {
    const [btnAction, setBtnAction] = useState<string | null>("Buy");
    const [currency, setCurrency] = useState("NGN");
    const [amount, setAmount] = useState(0);

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };
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
                    <section>
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-white mb-1"
                        >
                            Amount to buy
                        </label>

                        <div className="relative w-full">
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0.00"
                                className="w-full text-sm font-normal font-sans leading-5 h-12 px-3 py-2 rounded-lg 
                            shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple 
                            focus:shadow-lg border border-solid border-slate-300 hover:border-gray-700
                              dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <Select
                                    value={currency}
                                    placeholder="Token"
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 shadow-md shadow-slate-100 dark:shadow-slate-900 border border-solid border-slate-300 hover:border-gray-700
                              dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0">
                                    <MenuItem value="NGN">NGN</MenuItem>
                                    <MenuItem value="USD">USD</MenuItem>
                                    <MenuItem value="EUR">EUR</MenuItem>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-2 text-sm text-white flex items-center">
                            <span>1.00 USDT = ₦1,498.00</span>
                            <Sync className="ml-2 mr-1" />
                            <span>Est. fee: $1.90</span>
                        </div>
                    </section>

                    <div className="flex justify-center my-4">
                        <Swap className="size-4 cursor-pointer" />
                    </div>

                    <section>
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-white mb-1"
                        >
                            Amount to receive
                        </label>
                        <div className="relative w-full">
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0.00"
                                className="w-full text-sm font-normal font-sans leading-5 h-12 px-3 py-2 rounded-lg 
                            shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple 
                            focus:shadow-lg border border-solid border-slate-300 hover:border-gray-700
                              dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <Select
                                    value={currency}
                                    placeholder="Token"
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 shadow-md shadow-slate-100 dark:shadow-slate-900 border border-solid border-slate-300 hover:border-gray-700
                              dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
                                >
                                    <MenuItem value="NGN">NGN</MenuItem>
                                    <MenuItem value="USD">USD</MenuItem>
                                    <MenuItem value="EUR">EUR</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </section>
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
