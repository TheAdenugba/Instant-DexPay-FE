/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddressState } from "../models/userModel";

const initialState: AddressState = {
    status: "idle",
    data: null,
    hashedEmail: null,
    emailVerified: null,
    walletStatus: null,
    signature: null,
    signatureMessage: null,
    tradeSignature: null,
    error: null,
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        resetAddressState: () => initialState,
        updateAddressData(state, action: PayloadAction<any>) {
            state.data = action.payload;
            state.hashedEmail = action.payload?.emailAddress;
            state.emailVerified = action.payload?.emailVerified;
            state.walletStatus = action.payload?.status;
        },
        updateSignature(state, action: PayloadAction<any>) {
            state.signature = action.payload.signature;
            state.signatureMessage = action.payload.signatureMessage;
        },
        updateTradeSignature(state, action: PayloadAction<any>) {
            state.tradeSignature = action.payload;
        }
    },
});

export const {
    resetAddressState,
    updateAddressData,
    updateSignature,
    updateTradeSignature
} = addressSlice.actions;

export default addressSlice.reducer;
