import { IconButton, Select, MenuItem, FormControlLabel, Switch } from '@mui/material'
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
    LinkItems: {
        href: string;
        tabName: string;
    }[]
    pathName: string
    useDarkTheme: boolean
    onChange?: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void)
}
const AppHeader = ({ LinkItems, pathName, useDarkTheme, onChange }: Props) => {
    const router = useRouter()
    return (
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                <nav>
                    <ul className='list-none flex space-x-8 cursor-pointer'>
                        {LinkItems.map(el => {
                            return (
                                <li
                                    onClick={() => router.push(el.href)}
                                    key={el.tabName}
                                    className={`p-4 border-0 ${pathName === el.href ? 'border-b-4 border-solid border-b-[#F92556]' : 'list-none'}`}>
                                    {el.tabName}</li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <IconButton color="inherit">
                    {/* <Notifications /> */}
                </IconButton>
                <Select
                    value="BSC"
                    className="bg-gray-800 text-white"
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } }}
                >
                    <MenuItem value="BSC">BSC</MenuItem>
                </Select>
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <FormControlLabel
                    control={
                        <Switch
                            checked={useDarkTheme}
                            inputProps={{ "aria-label": "Dark Mode" }}
                            onChange={onChange}
                        ></Switch>
                    }
                    label="Dark Mode"
                    labelPlacement="start"
                />
            </div>
        </header>
    )
}

export default AppHeader