'use client'
import { MenuItem, Select } from '@mui/material'
import React from 'react'

type Props = {
    val: string;
    label: string;
    setSelectVal: (value: string) => void;
    options: string[]; // Array of currency options
}
export const AppSelect = ({ val, label, setSelectVal, options }: Props) => {
    return (
        <main>
            <label htmlFor="val" className="text-sm font-medium text-white mb-1 flex justify-between items-center">
                <div className="text-md">{label}</div>
            </label>
            <div className="relative w-full">
                <Select
                    fullWidth
                    value={val}
                    onChange={(e) => setSelectVal(e.target.value as string)}
                    className="h-12 rounded-lg border-transparent bg-transparent py-0 pl-2 pr-7 shadow-md shadow-slate-100 dark:shadow-slate-900 border border-solid border-slate-300 hover:border-gray-700
              dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
                >
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </main>
    )
}
