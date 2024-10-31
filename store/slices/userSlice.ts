/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, ReferralDetails, UserInfo } from '../models/userModel';

interface UserState {
    user: User;
    userInfo: UserInfo;
    emailOtp: string;
    newEmail: string;
    nonce: any;
    isLoading: boolean;
    userInfoLoading: boolean;
    error: string;
    message: string;
    network: string;
    walletConnected: boolean;
    walletStatus: string;
    isAuthenticated: boolean;
    userNotificationLoading: boolean;
    userNotifications: any;
    pendingNotification: number;
    newTradeMessage: number;
    socket: any;
    referralDetailsLoading: boolean;
    referralDetails: ReferralDetails;
    leaderBoard: Array<object>;
    leaderBoardLoading: boolean;
}

const initialState: UserState = {
    user: {
        _id: "",
        firstName: "",
        lastName: "",
        username: "",
        type: "",
        status: "",
        publicAddress: "",
        progress: 0,
        nonce: 0,
        emailVerified: false,
        emailAddress: "",
        createdAt: "",
        updatedAt: "",
        verifiedCheck: false,
        phoneNumber: "",
        phoneVerified: false,
    },
    userInfo: {
        completedTrades: 0,
        cancelledTrades: 0,
        redFlags: 0,
        tradeActivity: 0,
        totalVolume: "0",
        positiveRatingPercent: "0",
        positiveRatings: 0,
        negativeRatings: 0,
        openOrders: [],
    },
    emailOtp: "",
    newEmail: "",
    nonce: null,
    isLoading: true,
    userInfoLoading: false,
    error: "",
    message: "",
    network: "Unsupported Network",
    walletConnected: false,
    walletStatus: "INACTIVE",
    isAuthenticated: false,
    userNotificationLoading: false,
    userNotifications: [],
    pendingNotification: 0,
    newTradeMessage: 0,
    socket: null,
    referralDetailsLoading: false,
    referralDetails: {
        _id: "",
        user: "",
        referralCode: "",
        referCount: 0,
        totalPoints: 0,
        tradePoints: 0,
        referPoints: 0,
        createdAt: "",
        updatedAt: "",
        position: 0,
    },
    leaderBoard: [],
    leaderBoardLoading: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUserState: () => initialState,
        connectWallet(state, action: PayloadAction<boolean>) {
            state.walletConnected = action.payload;
        },
        updateWalletAddress(state, action: PayloadAction<string>) {
            state.user.publicAddress = action.payload;
        },
        updateNewEmail(state, action: PayloadAction<string>) {
            state.newEmail = action.payload;
        },
        updateUser(state, action: PayloadAction<any>) {
            state.user = action.payload;
        },
        updateEmailAddress(state, action: PayloadAction<string>) {
            state.user.emailAddress = action.payload;
        },
        updateEmailOTP(state, action: PayloadAction<string>) {
            state.emailOtp = action.payload;
        },
        updateError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        updateMessage(state, action: PayloadAction<string>) {
            state.message = action.payload;
        },
        updateNetwork(state, action: PayloadAction<string>) {
            state.network = action.payload;
        },
        updateWalletStatus(state, action: PayloadAction<string>) {
            state.walletStatus = action.payload;
        },
        updateIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },
        updatePendingNotification(state, action: PayloadAction<any>) {
            state.pendingNotification = action.payload;
        },
        updateNewTradeMessage(state, action: PayloadAction<any>) {
            state.newTradeMessage = action.payload;
        },
        updateUserNotifications(state, action: PayloadAction<any>) {
            state.userNotifications = action.payload;
        },
        updateSocket(state, action: PayloadAction<any>) {
            state.socket = action.payload;
        },
        updateNonce(state, action: PayloadAction<any>) {
            state.nonce = action.payload;
        },
    },

});

export const {
    resetUserState,
    connectWallet,
    updateWalletAddress,
    updateEmailAddress,
    updateEmailOTP,
    updateError,
    updateMessage,
    updateNetwork,
    updateWalletStatus,
    updateUser,
    updateNewEmail,
    updateIsAuth,
    updatePendingNotification,
    updateUserNotifications,
    updateSocket,
    updateNewTradeMessage,
    updateNonce
} = userSlice.actions;

export default userSlice.reducer;