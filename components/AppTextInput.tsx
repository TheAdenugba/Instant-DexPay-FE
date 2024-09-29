'use client'
import { MenuItem, Select } from "@mui/material";

type Props = {
    label: string;
    val: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    extraLabel?: string
    disabled?: boolean
    placeholder: string
} & React.HTMLAttributes<HTMLInputElement>
const AppTextInput = ({
    label,
    val,
    onChange,
    extraLabel,
    disabled,
    placeholder,
    ...rest
}: Props) => {
    return (
        <main>
            <label htmlFor="val" className="text-sm font-medium text-white mb-1 flex justify-between items-center">
                <div className="text-md">{label}</div>
                <div className="text-gray-300 text-md">{extraLabel}</div>

            </label>

            <div className="relative w-full">
                <input
                    {...rest}
                    disabled={disabled}
                    type="text"
                    id="text"
                    value={val}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full text-sm font-normal font-sans leading-5 h-12 px-3 py-2 rounded-lg 
            shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple 
            focus:shadow-lg border border-solid border-slate-300 hover:border-gray-700
            dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"
                />
            </div>
        </main>
    );
};

export default AppTextInput;
