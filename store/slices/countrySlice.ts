/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { Country } from "../models/trade";

interface AssetState {
    _id: string;
    name: string;
    decimals: number;
    status: string;
    network: string;
    createdAt: string;
    updatedAt: string;
    symbol: string;
    tokenAddress: string;
}

interface CountryState {
    country: Country;
    defaultCurrency: string;
    ip: string;
    assets: Array<AssetState>;
    currencies: Array<any>;
    isLoading: boolean;
    error: string;
    message: string;
}

const initialState: CountryState = {
    country: {
        id: "234",
        name: "Nigeria",
        code: "NG",
        currencyCode: "NGN",
        currencyName: "Naira",
        currencySymbol: "₦",
    },
    defaultCurrency: "NGN",
    ip: "",
    assets: [],
    currencies: [],
    isLoading: true,
    error: "",
    message: "",
};

export const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {},
});

export default countrySlice.reducer;
