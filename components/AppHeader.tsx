/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    // IconButton,
    // Select,
    // MenuItem,
    // FormControlLabel,
    // Switch,
    Typography,
    Box,
    Drawer,
    Badge,
    Button,
    Menu,
    Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import Assets from "@/utils/assets";
// import NavigationIcon from "@/app/assets/icons/nav";
import Logo from "@/app/assets/images/logo.png";
import { useBreakPoints } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
// import { HeaderStyle } from "./GeneralModals/ModalStyles";
import { updatePendingNotification } from "@/store/slices/userSlice";
import { UserNotification } from "@/store/models/userModel";

type Props = {
    LinkItems: {
        href: string;
        tabName: string;
    }[];
    pathName: string;
    useDarkTheme: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export function getNotificationTitle(item: UserNotification) {
    switch (item.message) {
        case "Trade match":
            return (
                <>
                    Your order has been matched with @{item.originatorUser.username}.
                    Proceed to complete trade{" "}
                    <span style={{ color: "#FF6666" }}>ID:{item._id}</span>
                </>
            );
        case "Payment made":
            return (
                <>
                    Your order with @{item.originatorUser.username} has been marked as
                    paid. Please confirm payment to release asset{" "}
                    <span style={{ color: "#FF6666" }}>ID:{item._id}</span>
                </>
            );
        case "Token released":
            return (
                <>
                    @{item.originatorUser.username} has released{" "}
                    <span style={{ color: "#7CFC00" }}> {item.amount} {item?.tradeAd?.asset && item?.tradeAd?.asset}</span> to you
                    and the trade has been marked as completed{" "}
                    <span style={{ color: "#FF6666" }}>ID:{item._id}</span>
                </>
            );
        case "Trade message":
            return (
                <>
                    Your trade with ID:{" "}
                    <span style={{ color: "#FF6666" }}>{item._id}</span> has new message
                    from @{item.originatorUser.username}
                </>
            );
        default:
            return "Quick Notice";
    }
}
const AppHeader = ({ LinkItems, pathName, useDarkTheme, onChange }: Props) => {
    const { isAuthenticated, pendingNotification, userNotifications } = useAppSelector(
        (state: RootState) => state.userReducer
    );
    const { isConnected } = useAccount();
    const isLoggedIn = useIsLoggedIn();
    const dispatch = useAppDispatch();
    const router = useRouter();
    // const classes = HeaderStyle();
    // const { disconnect } = useDisconnect();
    const [open, setOpen] = React.useState(false);
    const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);
    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openNotif = Boolean(anchorElNotif);

    const toggleDrawer = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const { NOTIFICATION } = Assets;
    const { sm, md } = useBreakPoints();

    // const handleDisconnect = () => {
    //     window.localStorage.removeItem("provider");
    //     window.localStorage.removeItem("token");
    //     window.localStorage.removeItem("refreshToken");
    //     window.localStorage.removeItem("defaultAsset");
    //     disconnect();
    //     // toast.success("Wallet Disconnected", {
    //     //     id: "disconnected",
    //     // });
    // };

    const handleClickNotif = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElNotif(event.currentTarget);
    };

    const handleCloseNotif = () => {
        dispatch(updatePendingNotification(0));
        setAnchorElNotif(null);
    };

    // const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    return (
        <>
            <header className="flex justify-between items-center lg:px-20 px-2 py-2 border-b border-gray-700 bg-[#101828]">
                <div className="flex items-center space-x-4">
                    {/* <NavigationIcon onClick={() => toggleDrawer(true)} className="sm:hidden" /> */}
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
                            src={Logo}
                            alt="logo"
                            width={sm ? 45 : 20}
                            height={sm ? 45 : 20}
                            style={{ marginRight: "10px" }}
                        />
                    </Typography>
                    {md ? (
                        <nav>
                            <ul className="list-none flex space-x-8 cursor-pointer">
                                {LinkItems.map((el) => {
                                    return (
                                        <li
                                            onClick={() => router.push(el.href)}
                                            key={el.tabName}
                                            className={`p-4 border-0 ${pathName === el.href
                                                ? "border-b-4 border-solid border-b-[#F92556]"
                                                : "list-none"
                                                }`}
                                        >
                                            {el.tabName}
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    ) : null}
                </div>


                <div className="flex items-center space-x-4">
                    <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "flex" } }}>
                        {isLoggedIn && (
                            <Button
                                id="basic-button"
                                aria-controls={openNotif ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={openNotif ? "true" : undefined}
                                onClick={handleClickNotif}
                                sx={{
                                    my: 2,
                                    mx: sm ? 2 : -2,
                                    color: "white",
                                    textTransform: "initial",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    display: "block",
                                }}
                            >
                                {pendingNotification > 0 ? (
                                    <Badge
                                        badgeContent={pendingNotification}
                                        color="warning"
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                    >
                                        <Image
                                            src={NOTIFICATION}
                                            alt="notification"
                                            style={{ verticalAlign: "middle" }}
                                            width={24}
                                            height={24}
                                        />
                                    </Badge>
                                ) : (
                                    <Image
                                        src={NOTIFICATION}
                                        alt="notification"
                                        style={{ verticalAlign: "middle" }}
                                        width={24}
                                        height={24}
                                    />
                                )}
                            </Button>
                        )}

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorElNotif}
                            open={openNotif}
                            onClose={handleCloseNotif}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}
                            PaperProps={{
                                style: {
                                    maxHeight: "271px",
                                    width: "300px",
                                    background: "#16171D",
                                    border: "2px solid #1E2029",
                                    borderRadius: "8px",
                                },
                            }}
                        >
                            <Box>
                                {Array.isArray(userNotifications) &&
                                    userNotifications
                                        .filter(
                                            (it: { message: string }) =>
                                                it.message == "Trade match" ||
                                                it.message == "Payment made" ||
                                                it.message == "Token released" ||
                                                it.message == "Trade message"
                                        )
                                        .slice(0, 2)
                                        .map((notification: any, index: number) => (
                                            <Box key={index}>
                                                <Typography
                                                    sx={{
                                                        fontSize: "14px",
                                                        fontFamily: "Work Sans",
                                                        padding: "1rem 0.8rem",
                                                    }}
                                                >
                                                    {getNotificationTitle(notification)}
                                                </Typography>

                                                <Divider
                                                    sx={{
                                                        border: "1px solid #1E2029",
                                                        marginX: "0.8rem",
                                                    }}
                                                />
                                            </Box>
                                        ))}
                            </Box>

                            <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="flex-end"
                            >
                                {/* <Button
                              onClick={() => Router.push("/notifications")}
                              sx={{
                                  mr: 1.5,
                                  mt: 1,
                                  mb: 1.5,
                                  padding: "8px 16px",
                                  color: "white",
                                  backgroundColor: "#2E3141",
                                  borderRadius: "4px",
                                  textTransform: "initial",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  fontFamily: "Work Sans",
                              }}
                          >
                              View all
                          </Button> */}
                            </Box>
                        </Menu>
                    </Box>
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
                                {/* <div
                                    className={classes.addressFieldSmNew}
                                    style={{ cursor: "pointer" }}
                                    onClick={handleClick}
                                >
                                    <Image src={FRAME} alt="avatar" width={26} height={26} />
                                </div> */}
                            </div>
                        ) : (
                            <DynamicWidget />
                        )}
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
            <Drawer open={open} onClose={() => toggleDrawer(false)}>
                <></>
            </Drawer>
        </>
    );
};

export default AppHeader;
