import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
    dialog: {
        background: "rgba(30, 32, 41, 0.4)",
        backdropFilter: "blur(3.5px)",
    },
    dialogPaperDark: {
        background: "#16171D",
        border: "2px solid #1E2029",
        borderRadius: "8px",
        width: "456px",
    },
    titleDiv: {
        display: "flex",
        justifyContent: "space-between",
    },
    titleText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "21px",
        lineHeight: "25px",
        color: "#ffffff",
    },
    walletDiv: {
        marginTop: "48px",
        marginBottom: "48px",
        // background: "#111217",
        borderRadius: "16px",
        // padding: "16px",
    },
    warningDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    warningHeaderText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "21px",
        lineHeight: "25px",
        color: "#ffffff",
        marginBottom: "8px",
    },
    warningBodyText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontsize: "14px",
        lineHeight: "17px",
        textAlign: "center",
        color: "#F2F2F2",
        marginBottom: "8px",
    },
    btnDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    walletItem: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #1E2029",
        padding: "8px 16px",
        borderRadius: "8px",
    },
    walletAddress: {
        fontFamily: "Work Sans",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "19px",
        color: "#ffffff",
        marginLeft: "16px",
    },
    footerText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "17px",
        color: "#ffffff",
        textAlign: "center",
    },
    subText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#CBCBCB",
    },
    warningIcon: {
        marginBottom: "32px",
    },
    timeValue: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "21px",
        lineHeight: "25px",
        color: "#ffffff",
    },
    linkTeam: {
        color: "#FC3F6B",
    },
}));

export const ConnectWalletStyles = makeStyles(() => ({
    connectWalletDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    headerText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "25px",
        textAlign: "center",
    },
    bodyText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "19px",
        textAlign: "center",
    },
    btnDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    dialog: {
        background: "rgba(30, 32, 41, 0.4)",
        backdropFilter: "blur(3.5px)",
    },
    dialogPaperDark: {
        background: "#16171D",
        border: "2px solid #1E2029",
        borderRadius: "8px",
        width: "460px",
    },
    titleDiv: {
        display: "flex",
        justifyContent: "space-between",
    },
    titleText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "25px",
        color: "#ffffff",
    },
    walletDiv: {
        marginTop: "48px",
        marginBottom: "48px",
        background: "#111217",
        borderRadius: "16px",
        padding: "16px",
    },
    walletItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        border: "2px solid #2E2E2E",
        padding: "8px 16px",
        borderRadius: "8px",
        marginBottom: "15px",
    },
    walletItemLast: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        border: "2px solid #2E2E2E",
        padding: "8px 16px",
        borderRadius: "8px",
    },
    walletName: {
        fontFamily: "Work Sans",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "19px",
        color: "#ffffff",
        marginLeft: "16px",
    },
    footerText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "17px",
        color: "#ffffff",
        textAlign: "center",
    },
}));

export const EmailStyles = makeStyles(() => ({
    dialog: {
        background: "rgba(30, 32, 41, 0.4)",
        backdropFilter: "blur(3.5px)",
    },
    dialogPaperDark: {
        background: "#16171D",
        border: "2px solid #1E2029",
        borderRadius: "8px",
        width: "456px",
    },
    titleDiv: {
        display: "flex",
        justifyContent: "space-between",
    },
    titleText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "25px",
        color: "#ffffff",
    },
    walletDiv: {
        marginTop: "24px",
        marginBottom: "24px",
        // background: "#111217",
        borderRadius: "16px",
        // padding: "16px",
    },
    btnDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    walletItem: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #1E2029",
        padding: "8px 16px",
        borderRadius: "8px",
    },
    walletAddress: {
        fontFamily: "Work Sans",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "19px",
        color: "#ffffff",
        marginLeft: "16px",
    },
    filterOrder: {
        "& label.Mui-focused": {
            color: "green",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#636363",
                borderRadius: "32px",
            },
            "&:hover fieldset": {
                borderColor: "#636363",
            },
            "&.Mui-focused fieldset": {
                // borderColor: "white",
            },
        },
    },
    subText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#CBCBCB",
    },
    labelStyle: {
        color: "#ffffff",
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "17px",
    },
    labelColor: {
        color: "#F92556",
    },
    label: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#ffffff",
        marginBottom: "14px",
    },
    input: {
        "&::placeholder": {
            color: "#CBCBCB",
            fontFamily: "Work Sans",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "17px",
        },
    },
    footerText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "17px",
        color: "#979797",
        marginTop: "16px",
    },
}));

export const EmailVerifyStyles = makeStyles(() => ({
    dialog: {
        background: "rgba(30, 32, 41, 0.4)",
        backdropFilter: "blur(3.5px)",
    },
    dialogPaperDark: {
        background: "#16171D",
        border: "2px solid #1E2029",
        borderRadius: "8px",
        width: "456px",
    },
    titleDiv: {
        display: "flex",
        justifyContent: "space-between",
    },
    titleText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "25px",
        color: "#ffffff",
    },
    walletDiv: {
        marginTop: "48px",
        marginBottom: "0px",
        // background: "#111217",
        borderRadius: "16px",
        // padding: "16px",
    },
    btnDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    walletItem: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #1E2029",
        padding: "8px 16px",
        borderRadius: "8px",
    },
    walletAddress: {
        fontFamily: "Work Sans",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "19px",
        color: "#ffffff",
        marginLeft: "16px",
    },
    footerText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "17px",
        color: "#ffffff",
        textAlign: "center",
        marginBottom: "15px",
        cursor: "pointer",
    },
    verText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "17px",
        color: "#979797",
        marginTop: "16px",
    },
    subText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#CBCBCB",
    },
    labelStyle: {
        color: "#ffffff",
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "17px",
    },
    labelColor: {
        color: "#F92556",
    },
    input: {
        "&::placeholder": {
            color: "#CBCBCB",
            fontFamily: "Work Sans",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "17px",
        },
    },
    label: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#ffffff",
        marginBottom: "8px",
    },
    filterOrder: {
        "& input[type=number]": {
            "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& label.Mui-focused": {
            color: "green",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#636363",
                borderRadius: "32px",
            },
            "&:hover fieldset": {
                borderColor: "#636363",
            },
            "&.Mui-focused fieldset": {
                // borderColor: "white",
            },
        },
    },
    timer: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#FC3F6B",
    },
}));

export const SwitchNetworkStyle = makeStyles(() => ({
    dialog: {
        background: "rgba(30, 32, 41, 0.4)",
        backdropFilter: "blur(3.5px)",
    },
    dialogPaperDark: {
        background: "#16171D",
        border: "2px solid #1E2029",
        borderRadius: "8px",
        width: "456px",
    },
    titleDiv: {
        display: "flex",
        justifyContent: "space-between",
    },
    titleText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "21px",
        lineHeight: "25px",
        color: "#ffffff",
    },
    walletDiv: {
        marginTop: "48px",
        marginBottom: "48px",
        // background: "#111217",
        borderRadius: "16px",
        // padding: "16px",
    },
    warningDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    warningHeaderText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "21px",
        lineHeight: "25px",
        color: "#ffffff",
        marginBottom: "8px",
    },
    warningBodyText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 400,
        fontsize: "14px",
        lineHeight: "17px",
        textAlign: "center",
        color: "#F2F2F2",
    },
    btnDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    walletItem: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #1E2029",
        padding: "8px 16px",
        borderRadius: "8px",
    },
    walletAddress: {
        fontFamily: "Work Sans",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "19px",
        color: "#ffffff",
        marginLeft: "16px",
    },
    footerText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "17px",
        color: "#ffffff",
        textAlign: "center",
    },
    subText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "19px",
        color: "#CBCBCB",
    },
    warningIcon: {
        marginBottom: "32px",
    },
    timeValue: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "21px",
        lineHeight: "25px",
        color: "#ffffff",
    },
}));

export const HeaderStyle = makeStyles(() => ({
    root: {
        "& .MuiBottomNavigationAction-root": {
            color: "white",
        },
        "& .MuiBottomNavigation-root": {
            justifyContent: "space-between",
        },
        "& .MuiBottomNavigationAction-label": {
            opacity: 1,
            fontSize: "13px",
        },
        "&.MuiBottomNavigationAction-root.Mui-selected": {
            color: "yellow",
        },
    },
    addressField: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: ".6rem",
        background: "#16171D",
        border: "1px solid #1E2029",
        borderRadius: "64px",
        height: "49px",
    },
    addressFieldSm: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: ".6rem",
        background: "#16171D",
        border: "1px solid #1E2029",
        borderRadius: "32px",
        height: "40px",
    },
    addressFieldSmNew: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: ".6rem",
        background: "#16171D",
        border: "1px solid #1E2029",
        borderRadius: "32px",
        height: "40px",
    },
    addressStyle: {
        marginLeft: ".4rem",
        marginRight: ".4rem",
    },
    navText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "17px",
        marginRight: "44px",
        cursor: "pointer",
    },
    navTextSm: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "17px",
        marginRight: "14px",
        cursor: "pointer",
    },
    textLang: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "17px",
        color: "#ffffff",
    },
    textNetwork: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "17px",
        color: "#ffffff",
        textAlign: "center",
        padding: "0 15px",
    },
    menuPaper: {
        background: "#1E2029",
        color: "white",
    },
    menuList: {
        color: "white",
    },
}));

export const InputStyle = makeStyles(() => ({
    input: {
        /*     "&:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px #16171D inset",
          WebkitTextFillColor: "white",
          WebkitBorderBefore: "none",
          WebkitBorderAfter: "none",
        }, */
        "&::placeholder": {
            fontStyle: "normal",
            fontFamily: "Work Sans",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "19px",
            color: "#7D7D7D",
        },
    },
    helperText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: "14px",
        color: "#636363",
    },
    filterOrder: {
        "& .MuiOutlinedInput-input": {
            color: "white",
            height: "13px",
            fontSize: "16px",
        },
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            // borderRadius: "8px",
            // background: "#2E2E2E",
        },
        "& .MuiOutlinedInput-root.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            // borderRadius: "8px",
            // background: "gray !important",
        },
        "& label.Mui-focused": {
            color: "green",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#1E2029",
                borderRadius: "64px",
            },
            "&:hover fieldset": {
                borderColor: "#1E2029",
            },
            "&.Mui-focused fieldset": {
                borderColor: "white",
            },
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
    },
    filterOrderBorderLess: {
        "& .MuiOutlinedInput-input": {
            color: "white",
            height: "13px",
            fontSize: "16px",
        },
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            borderRadius: "32px",
            background: "#2E2E2E",
        },
        "& .MuiOutlinedInput-root.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            borderRadius: "32px",
            background: "#2E2E2E !important",
        },
        "& label.Mui-focused": {
            color: "green",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green",
        },
        "& .MuiOutlinedInput-root": {
            paddingLeft: "0px !important",
            "& fieldset": {
                borderColor: "#1E2029",
                borderRadius: "64px",
            },
            "&:hover fieldset": {
                borderColor: "#1E2029",
            },
            "&.Mui-focused fieldset": {
                borderColor: "white",
            },
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
    },
    filterOrderSm: {
        "& .MuiOutlinedInput-input": {
            color: "white",
            height: "13px",
            fontSize: "16px",
        },
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            borderRadius: "32px",
            background: "#2E2E2E",
        },
        "& .MuiOutlinedInput-root.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            borderRadius: "32px",
            background: "#2E2E2E !important",
        },
        "& label.Mui-focused": {
            color: "green",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#1E2029",
                borderRadius: "64px",
            },
            "&:hover fieldset": {
                borderColor: "#1E2029",
            },
            "&.Mui-focused fieldset": {
                borderColor: "white",
            },
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
    },
    filterOrderSmBorderLess: {
        "& .MuiOutlinedInput-input": {
            color: "white",
            height: "13px",
            fontSize: "16px",
        },
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            borderRadius: "32px",
            background: "#2E2E2E",
        },
        "& .MuiOutlinedInput-root.Mui-disabled": {
            WebkitTextFillColor: "#fff",
            borderRadius: "32px",
            background: "#2E2E2E !important",
        },
        "& label.Mui-focused": {
            color: "green",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "green",
        },
        "& .MuiOutlinedInput-root": {
            paddingLeft: "0px !important",
            "& fieldset": {
                borderColor: "#1E2029",
                borderRadius: "64px",
            },
            "&:hover fieldset": {
                borderColor: "#1E2029",
            },
            "&.Mui-focused fieldset": {
                borderColor: "white",
            },
        },
        "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
        },
    },
    error: {
        color: "#FD2626",
        marginTop: "10px",
        fontSize: "14px",
    },
    success: {
        color: "#14C005",
        marginTop: "10px",
        fontSize: "14px",
    },
}));

export const LabelStyle = makeStyles(() => ({
    textLabel: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "19px",
        color: "#CBCBCB",
        fontSize: "16px",
        // marginBottom: "12px",
    },
    labelDivSecond: {
        width: "100%",
        marginTop: "10px",
    },
    labelDiv: {
        marginBottom: "32px",
        width: "100%",
    },
    textLabelDiv: {
        display: "flex",
        justifyContent: "space-between",
    },
    textLabelReceiveDiv: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    balanceText: {
        fontFamily: "Work Sans",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "11px",
        lineHeight: "14px",
        color: "#BEBEBE",
    },
}))