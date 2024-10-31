/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { makeStyles } from "@mui/styles";
import { Select, Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
    select: {
        border: "1px solid #636363",
        "& .MuiOutlinedInput-input": {
            color: "white",
            height: "13px",
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
    },
    success: {
        color: "#14C005",
        marginTop: "10px",
        fontSize: "14px",
    },
}));

const TextSelect = ({
    name,
    value,
    defaultValue,
    onChange,
    children,
    successText = null,
    disabled = false,
}: any) => {
    const classes = useStyles();
    return (
        <>
            <Select
                labelId="demo-simple-select-helper-label"
                id="outlined-select-currency-native"
                defaultValue={defaultValue}
                className={classes.select}
                name={name}
                onChange={(e) => onChange(e)}
                value={value}
                disabled={disabled}
                MenuProps={{
                    sx: {
                        "& .MuiMenu-paper": {
                            backgroundColor: "#1E2029",
                            color: "white",
                        },
                        "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#2E3141",
                            color: "white",
                            border: "",
                        },
                        "& .Mui-selected": {
                            backgroundColor: "black",
                            color: "white",
                        },
                    },
                }}

                sx={{
                    borderTopRightRadius: '8px',
                    borderTopLeftRadius: '0px',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '8px',
                    border: "1px solid #636363",
                    color: "#fff",
                    "& .MuiSelect-select": {
                        height: "13px !important",
                        minHeight: "13px !important",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    },
                    "& fieldset": { border: "none" },
                    ".css-1my1jh6-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root":
                    {
                        border: "1px solid #636363",
                    },
                    ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                        color: "#fff",
                    },
                    ".MuiSvgIcon-root": {
                        color: "#fff",
                    },
                }}
            >
                {children}
            </Select>
            {successText && (
                <Typography className={classes.success}>{successText}</Typography>
            )}
        </>
    );
};

export default TextSelect;
