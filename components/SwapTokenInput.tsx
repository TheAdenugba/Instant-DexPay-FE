/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertToCurrency, useBreakPoints } from '@/utils';
import { InputAdornment, TextField, Typography } from '@mui/material';
import React from 'react'
import toast from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';
import { InputStyle } from './GeneralModals/ModalStyles';

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

type Props = {
    disabled?: boolean
    maxLimit?: boolean
    maxInputAmount?: number
    fullWidth?: boolean
    value: string
    name: string
    placeholder: string
    onChange: (e: any) => void
    helperText?: string
    errorText?: any
    successText?: any
    endAdorn?: any
    borderLess?: any,
    onFocus: (_: any) => void,
}

const SwapTokenInput = ({
    disabled = false,
    maxLimit = false,
    maxInputAmount = 1000,
    fullWidth = true,
    value,
    name,
    placeholder,
    onChange,
    helperText,
    errorText = null,
    successText = null,
    borderLess = false,
    endAdorn,
    onFocus = (_: any) => _,
}: Props) => {
    const { sm } = useBreakPoints();
    const classes = InputStyle();
    return (
        <>
            <TextField
                onFocus={onFocus}
                disabled={disabled}
                fullWidth={fullWidth}
                name={name}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                value={+value}
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
                autoComplete={'off'}
                helperText={
                    helperText && (
                        <Typography variant="body2" className={classes.helperText}>
                            {helperText}
                        </Typography>
                    )
                }

                sx={{
                    border: `1px solid #636363`,
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    color: "#fff",
                    "& fieldset": { border: "none" },
                    ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                        color: "#fff",
                    },
                }}

                slotProps={{
                    inputLabel: {
                        style: { color: "white" },
                    },
                    input: {
                        classes: { input: classes.input },
                        inputComponent: NumberFormatCustom,
                        inputProps: { maxLimit, maxInputAmount },
                        endAdornment: endAdorn ? (
                            <InputAdornment position="end">{endAdorn}</InputAdornment>
                        ) : null,
                    },
                }}
            />
            {errorText && (
                <Typography className={classes.error}>{errorText}</Typography>
            )}
            {successText && (
                <Typography className={classes.success}>{successText}</Typography>
            )}
        </>
    )
}

export default SwapTokenInput