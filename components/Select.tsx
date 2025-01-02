/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    FormHelperText,
    FormLabel,
    useTheme,
    Box,
} from '@mui/material';
import { ArrowDown2 } from 'iconsax-react';
import React from 'react';
import Select, {
    components,
    SingleValueProps,
    OptionProps,
    DropdownIndicatorProps,
    GroupBase,
    PropsValue,
} from 'react-select';
import type { MultiValue, SingleValue } from 'react-select';

export interface SelectProps {
    value: string;
    label: string;
    svgIcon?: string;
    fullText?: string;
    amount?: string; // Optional amount
}

interface SelectComponentProps {
    placeholder?: string;
    value?: PropsValue<SelectProps>;
    name?: string;
    errors?: unknown;
    label?: string;
    onChange: (
        newValue: MultiValue<SelectProps> | SingleValue<SelectProps>
    ) => void;
    options?: SelectProps[];
    defaultValue?: PropsValue<SelectProps>;
    errorMessage?: string;
    isSearchable?: boolean;
}

const DropdownIndicator: React.FC<
    DropdownIndicatorProps<SelectProps, false, GroupBase<SelectProps>>
> = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <ArrowDown2 size="22" />
        </components.DropdownIndicator>
    );
};

const Option: React.FC<
    OptionProps<SelectProps, false, GroupBase<SelectProps>>
> = (props) => {
    const theme = useTheme(); // Dynamic theme
    const { data, isFocused } = props;

    return (
        <components.Option {...props}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding="8px 10px"
                bgcolor={isFocused ? theme.palette.action.hover : 'transparent'}
                borderRadius="5px"
            >
                <Box display="flex" alignItems="center" gap={1}>
                    {data?.svgIcon && data.svgIcon
                        // (
                        // <img
                        //     src={data.svgIcon}
                        //     alt="logo"
                        //     className="option-logo"
                        //     style={{ width: 20, height: 20 }}
                        // />
                        // )
                    }
                    <span>{data.label}</span>
                </Box>
                {data?.amount && (
                    <span style={{ color: theme.palette.text.secondary }}>
                        {data.amount}
                    </span>
                )}
            </Box>
        </components.Option>
    );
};

const SingleValue: React.FC<SingleValueProps<SelectProps>> = ({
    children,
    ...props
}) => (
    <components.SingleValue {...props}>
        <Box display="flex" justifyContent={'space-between'} width={'100%'} alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
                {props.data?.svgIcon && props.data.svgIcon}
                {children}
            </Box>
            <Box justifyContent={'flex-end'} style={{ color: '#fff' }}>
                {props.data.amount}
            </Box>
        </Box>
    </components.SingleValue>
);

const SelectComponent = React.forwardRef<any, SelectComponentProps>(
    (
        {
            name,
            value,
            label,
            placeholder,
            options,
            onChange,
            defaultValue,
            errorMessage,
            isSearchable,
        },
        ref
    ) => {
        const theme = useTheme(); // Get MUI theme

        return (
            <FormControl fullWidth>
                {label && (
                    <FormLabel
                        sx={{
                            fontSize: '16px',
                            color: theme.palette.text.primary,
                            fontWeight: '400',
                        }}
                    >
                        {label}
                    </FormLabel>
                )}

                <Select
                    isMulti={false}
                    defaultValue={defaultValue}
                    isSearchable={isSearchable}
                    name={name}
                    value={value}
                    closeMenuOnSelect={true}
                    placeholder={placeholder}
                    options={options}
                    onChange={onChange}
                    ref={ref}
                    styles={{
                        singleValue: (base) => ({
                            ...base,
                            display: 'flex',
                            alignItems: 'center',
                            color: theme.palette.text.primary,
                        }),
                        control: (provided: any, state: any) => ({
                            ...provided,
                            borderColor: state.isFocused
                                ? theme.palette.primary.main
                                : '#636363',
                            boxShadow: 'none',
                            borderRadius: '0.5rem',
                            height: '48px',
                            fontWeight: '400',
                            backgroundColor: '#101828',
                            color: theme.palette.text.primary,
                        }),
                        placeholder: (base) => ({
                            ...base,
                            fontSize: '1em',
                            color: theme.palette.text.secondary,
                            fontWeight: 400,
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '0.5rem',
                        }),
                        option: (base) => ({
                            ...base,
                            backgroundColor: '#101828',
                            color: theme.palette.text.primary,
                        }),
                        input: (base) => ({
                            ...base,
                            color: theme.palette.text.secondary, // Make the text white
                        }),
                    }}
                    theme={(reactSelectTheme) => ({
                        ...reactSelectTheme,
                        borderRadius: 5,
                        colors: {
                            ...reactSelectTheme.colors,
                            primary: theme.palette.primary.main,
                            primary25: theme.palette.action.hover,
                            neutral0: theme.palette.background.paper,
                        },
                    })}
                    components={{
                        DropdownIndicator,
                        SingleValue,
                        Option,
                    }}
                />
                {errorMessage && (
                    <FormHelperText
                        sx={{
                            fontSize: '1rem',
                            color: theme.palette.error.main,
                        }}
                    >
                        {errorMessage}
                    </FormHelperText>
                )}
            </FormControl>
        );
    }
);
SelectComponent.displayName = 'AppSelect';
export default SelectComponent;
