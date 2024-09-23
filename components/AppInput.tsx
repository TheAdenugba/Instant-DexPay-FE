'use client'
import { MenuItem, Select } from "@mui/material";

interface Props {
    label: string;
    amount: number;
    onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    currency: string;
    setCurrency: (value: string) => void;
    currencyOptions: string[]; // Array of currency options
}
const AppInput = ({
    label,
    amount,
    onAmountChange,
    currency,
    setCurrency,
    currencyOptions,
}: Props) => {
    return (
        <main>
            <label htmlFor="amount" className="block text-sm font-medium text-white mb-1">
                {label}
            </label>

            <div className="relative w-full">
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={onAmountChange}
                    placeholder="0.00"
                    className="w-full text-sm font-normal font-sans leading-5 h-12 px-3 py-2 rounded-lg 
            shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple 
            focus:shadow-lg border border-solid border-slate-300 hover:border-gray-700
            dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <Select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as string)}
                        className="h-full rounded-r-lg border-transparent bg-transparent py-0 pl-2 pr-7 shadow-md shadow-slate-100 dark:shadow-slate-900 border border-solid border-slate-300 hover:border-gray-700
              dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
                    >
                        {currencyOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
        </main>
    );
};

export default AppInput;
