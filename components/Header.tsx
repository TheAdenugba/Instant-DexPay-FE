import Image from "next/image";
import { useBreakPoints } from "@/utils";
import { AppBar, Badge, Box, Container, createTheme, Toolbar, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import React, { useState } from "react";
import { HeaderStyle } from "./GeneralModals/ModalStyles";
import { usePathname, useRouter } from "next/navigation";
import Assets from "@/utils/assets";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useAccount } from "wagmi";

const Header = () => {
    const pathName = usePathname();
    const router = useRouter();
    const classes = HeaderStyle();
    const { isAuthenticated } = useAppSelector((state: RootState) => state.userReducer);
    const { isConnected } = useAccount();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { xxs, xs, sm, md, lg, xl } = useBreakPoints();
    const theme = createTheme({
        palette: {
            primary: {
                main: "#111217",
            },
            secondary: {
                main: "#11cb5f",
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        background: "#16171D",
                        color: "#fff",
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        flexDirection: "row",
                        justifyContent: "space-between",
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: "none",
                        borderBottom: "1px solid #1A1C23",
                    },
                },
            },
        },
    });
    const { SEND, RECEIVED, TRADE, LOGO, NOTIFICATION, FRAME, ARROW_DOWN, ARROW_RIGHT } =
        Assets;
    const LinkItems = [
        {
            href: "/",
            tabName: "Send Money",
        },

        {
            href: "/instant-buy",
            tabName: "Instant Buy/Sell",
        },
        {
            href: "#",
            tabName: "DexPay",
        },
    ];
    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    console.log(isAuthenticated, isConnected)
    return (
        <ThemeProvider theme={theme}>
            <AppBar
                style={{
                    paddingTop: sm ? "5px" : "4px",
                    paddingBottom: sm ? "5px" : "4px",
                }}
                position="fixed"
                color="primary"
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
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
                        <Container
                            maxWidth={false}
                            style={{
                                maxWidth: "1344px",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                margin: sm ? "0 0 0 44px" : "0px",
                                paddingRight: "0px",
                                paddingLeft: "0px",
                            }}
                        >
                            {/* <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                {LinkItems.map((page, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {Array.isArray(page.children) ? null : (
                      <Typography
                        variant="body2"
                        className={classes.navText}
                        onClick={() => {
                          if (page.url) {
                            handleNavUrlClick(page.url, page.level1required);
                          }
                        }}
                        sx={{
                          my: 2,
                          color: "white",
                          textTransform: "none",
                          display: "block",
                        }}
                      >
                        <Link2
                          sx={{
                            textDecoration: "none",
                          }}
                        >
                          <a
                            style={{
                              textDecoration: "none",
                              color: page.url === "/p2p-express" ? "#1E2029" : "white",
                              fontSize: "16px",
                              background:
                                page.url === "/p2p-express" ? "white" : "inherit",
                              padding: page.url === "/p2p-express" ? "12px" : "inherit",
                              borderRadius: "64px",
                            }}
                          >
                            {page.name == "Pending" && isConnected && pendingOrder > 0 ? (
                              <Badge
                                badgeContent={pendingOrder}
                                color="warning"
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "right",
                                }}
                              >
                                Pending
                              </Badge>
                            ) : (
                              page.name
                            )}
                          </a>
                        </Link2>
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box> */}
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
                                ) : (
                                    <DynamicWidget />

                                )}
                            </Box>
                        </Container>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
};

export default Header;
