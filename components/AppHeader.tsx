import { IconButton, Select, MenuItem, FormControlLabel, Switch, Typography, Box } from '@mui/material'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Image from "next/image";
import { useAccount, useDisconnect } from 'wagmi';
import Assets from '@/utils/assets';
import { useBreakPoints } from '@/utils';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { HeaderStyle } from './GeneralModals/ModalStyles';

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
    const classes = HeaderStyle();
    const { disconnect } = useDisconnect();
    const { SEND, RECEIVED, TRADE, LOGO, NOTIFICATION, FRAME, ARROW_DOWN, ARROW_RIGHT } =
        Assets;;
    const { xxs, xs, sm, md, lg, xl } = useBreakPoints();

    const { isAuthenticated } = useAppSelector((state: RootState) => state.userReducer);
    const { isConnected } = useAccount();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDisconnect = () => {
        window.localStorage.removeItem("provider");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("defaultAsset");
        disconnect();
        // toast.success("Wallet Disconnected", {
        //     id: "disconnected",
        // });
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <header className="flex px-8 justify-between items-center p-4 border-b border-gray-700">
            <div className="flex items-center space-x-4">
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    onClick={() => {
                        router.push("/");
                    }}
                    sx={{
                        display: "flex",
                        fontFamily: "Work Sans",
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    <Image
                        src={LOGO}
                        alt="logo"
                        width={sm ? 45 : 20}
                        height={sm ? 45 : 26}
                        style={{ marginRight: "10px" }}
                    />
                </Typography>
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
                <Box sx={{ flexGrow: 0 }}>
                    {isAuthenticated && isConnected ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "5px",
                            }}
                        >
                            <DynamicWidget />
                            <div
                                className={classes.addressFieldSmNew}
                                style={{ cursor: "pointer" }}
                                onClick={handleClick}
                            >
                                <Image
                                    src={FRAME}
                                    alt="avatar"
                                    width={26}
                                    height={26}
                                />
                            </div>
                        </div>
                    ) : (<DynamicWidget />)}
                </Box>

                {/* <FormControlLabel
                    control={
                        <Switch
                            checked={useDarkTheme}
                            inputProps={{ "aria-label": "Dark Mode" }}
                            onChange={onChange}
                        ></Switch>
                    }
                    label="Dark Mode"
                    labelPlacement="start"
                /> */}
            </div>
        </header>
    )
}

export default AppHeader