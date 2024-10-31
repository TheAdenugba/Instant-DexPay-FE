/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { makeStyles } from "@mui/styles";
import { TextField, InputAdornment, Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";
import toast from "react-hot-toast";
import { convertToCurrency, useBreakPoints } from "@/utils";

function NumberFormatCustom(props: any) {
  const { inputRef, onChange, maxLimit, maxInputAmount, ...other } = props;

  return (
    <NumericFormat
      allowLeadingZeros={true}
      isAllowed={(values) => {
        const { formattedValue, floatValue } = values;
        // if max limit is set to true go ahead with validation
        if (maxLimit) {
          if (floatValue && floatValue > maxInputAmount) {
            toast.error(
              `Max amount is ${convertToCurrency(
                maxInputAmount
              )}`,
              {
                id: "error",
              }
            );
          }
          // console.log("problem is here " + formattedValue + " >>>> " + floatValue);
          return (
            formattedValue === "" ||
            (floatValue && floatValue <= maxInputAmount)
          );
        } else {
          //  console.log("problem is yo");
          return true;
        }
      }}
      {...other}
      getInputRef={inputRef}
      onValueChange={(values: { value: any }) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
    // isNumericString
    />
  );
}

const useStyles = makeStyles(() => ({
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

const TextInput = ({
  name,
  value,
  placeholder,
  onChange,
  inputType = "text",
  startAdorn,
  endAdorn,
  fullWidth = true,
  helperText,
  disabled = false,
  autoComplete = "off",
  errorText = null,
  successText = null,
  multiline = false,
  rows = 1,
  borderRadius = "64px",
  borderColor = "#636363",
  maxLimit = false,
  maxInputAmount = 1000,
  borderLess = false,
  onFocus = (_: any) => _,
}: any) => {
  const classes = useStyles();
  const { sm } = useBreakPoints();
  return (
    <>
      <TextField
        onFocus={onFocus}
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        fullWidth={fullWidth}
        name={name}
        onChange={(e) => {
          onChange(e);
        }}
        value={value}
        placeholder={placeholder}
        className={
          sm && borderLess
            ? classes.filterOrderBorderLess
            : !sm && borderLess
              ? classes.filterOrderSmBorderLess
              : sm && !borderLess
                ? classes.filterOrder
                : classes.filterOrderSm
        }
        autoComplete={autoComplete}
        helperText={
          helperText && (
            <Typography variant="body2" className={classes.helperText}>
              {helperText}
            </Typography>
          )
        }
        InputLabelProps={{
          style: { color: "white" },
        }}
        sx={{
          border: `1px solid ${borderColor}`,
          borderRadius: borderRadius,
          color: "#fff",
          "& fieldset": { border: "none" },
          ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
            color: "#fff",
          },
        }}
        InputProps={{
          inputComponent: inputType == "number" ? NumberFormatCustom : "input",
          inputProps: { maxLimit, maxInputAmount },
          classes: { input: classes.input },
          startAdornment: startAdorn ? (
            <InputAdornment position="start" sx={{ background: borderLess ? "none" : "#2E2E2E" }}>
              {startAdorn}
            </InputAdornment>
          ) : null,
          endAdornment: endAdorn ? (
            <InputAdornment position="end">{endAdorn}</InputAdornment>
          ) : null,
        }}
      />

      {errorText && (
        <Typography className={classes.error}>{errorText}</Typography>
      )}
      {successText && (
        <Typography className={classes.success}>{successText}</Typography>
      )}
    </>
  );
};

export default TextInput;
