/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TradePostDataState, ReqObj, ExpressOrderDataState } from "../models/trade";

interface TradeState {
    tradeData: TradePostDataState;
    payments: Array<object>;
    paymentAccount: any;
    trades: Array<object>;
    userTrades: Array<object>;
    userOrders: Array<object>;
    tradesLoading: boolean;
    ordersLoading: boolean;
    paymentsLoading: boolean;
    claimFundsLoading: boolean;
    currentTrade: any | null;
    error: string | null;
    tradeSigLoading: boolean;
    tradeReqObj: ReqObj;
    orderSigLoading: boolean;
    orderReqObj: ReqObj;
    pendingOrder: number;
    timeUp: boolean;
    expressOrderData: ExpressOrderDataState;
    overviewTab: number;
    additionalQuantity: number;
}

const initialState: TradeState = {
    tradeData: {
        type: "",
        paymentAccountId: "",
        fiat: "NGN",
        price: null,
        quantity: null,
        minLimit: null,
        maxLimit: null,
        paymentTime: null,
        instruction: "",
        asset: "",
        serviceFee: "",
        quantityAvailable: null,
        priceType: "MANUAL",
        percentToMarketPrice: "0",
        prefix: "+",
        minPriceLimit: null,
        maxPriceLimit: null,
    },
    payments: [],
    paymentAccount: {
        id: "",
        bankName: "",
        accountName: "",
        bankCode: "",
        accountNumber: "",
    },
    trades: [],
    userTrades: [],
    userOrders: [],
    tradesLoading: true,
    ordersLoading: false,
    tradeSigLoading: false,
    orderSigLoading: false,
    paymentsLoading: false,
    claimFundsLoading: false,
    currentTrade: null,
    error: null,
    tradeReqObj: {
        message: {
            from: "",
            nonce: "",
            to: "",
            validUntil: "",
        },

        signature: "",
    },
    orderReqObj: {
        message: {
            from: "",
            nonce: "",
            to: "",
            validUntil: "",
        },

        signature: "",
    },
    pendingOrder: 0,
    timeUp: false,
    expressOrderData: {
        amount: "",
        amountToReceive: "",
        fiat: "",
        asset: "",
        price: null,
        paymentMethod: "",
        orderType: "",
        firstName: "",
        lastName: "",
        paymentAccountId: "",
        serviceFee: "",
        inputField: "",
    },
    overviewTab: 0,
    additionalQuantity: 0,
};

const tradeSlice = createSlice({
    name: "trade",
    initialState,
    reducers: {
        resetTradeState: () => initialState,
        updateTradeData(state, action: PayloadAction<any>) {
            /* return action.payload; */
            state.tradeData = action.payload;
        },
        updateExpressOrderData(state, action: PayloadAction<any>) {
            /* return action.payload; */
            state.expressOrderData = action.payload;
        },
        updateCurrentTradeDetail(state, action: PayloadAction<any>) {
            state.currentTrade = action.payload;
        },
        updatePaymentAccount(state, action: PayloadAction<any>) {
            state.paymentAccount = action.payload;
        },
        updateUserOrders(state, action: PayloadAction<any>) {
            state.userOrders = action.payload;
        },
        updatePendingOrders(state, action: PayloadAction<any>) {
            state.pendingOrder = action.payload;
        },
        updateTimeUp(state, action: PayloadAction<any>) {
            state.timeUp = action.payload;
        },
        updateOverviewTab(state, action: PayloadAction<any>) {
            state.overviewTab = action.payload;
        },
        updateAdditionalQuantity(state, action: PayloadAction<any>) {
            state.additionalQuantity = action.payload;
        },
    },

});

export const {
    resetTradeState,
    updateTradeData,
    updateCurrentTradeDetail,
    updatePaymentAccount,
    updateUserOrders,
    updatePendingOrders,
    updateTimeUp,
    updateExpressOrderData,
    updateOverviewTab,
    updateAdditionalQuantity
} = tradeSlice.actions;

export default tradeSlice.reducer;
