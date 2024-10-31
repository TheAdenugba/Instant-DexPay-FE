/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TradeSignature {
    message: object;
    signature: string;
}
export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    type: string;
    status: string;
    publicAddress: string;
    progress: number;
    nonce: number;
    emailVerified: boolean;
    emailAddress: string;
    createdAt: string;
    updatedAt: string;
    verifiedCheck: boolean;
    phoneNumber: string;
    phoneVerified: boolean;
}

export interface UserInfo {
    completedTrades: number;
    cancelledTrades: number;
    redFlags: number;
    tradeActivity: number;
    totalVolume: string;
    positiveRatings: number;
    negativeRatings: number;
    positiveRatingPercent: string;

    openOrders: Array<any>;
}

export interface UserNotification {
    _id: string;
    user: any;
    originatorUser: any;
    tradeActivity: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    amount: number;
}

export interface AddressState {
    status: "idle" | "loading" | "succeeded" | "failed";
    data: object | null;
    error: string | null;
    hashedEmail: string | null;
    emailVerified: boolean | null;
    walletStatus: string | null;
    signature: string | null;
    tradeSignature: TradeSignature | null;
    signatureMessage: any;
}

export interface checkAddressDto {
    publicAddress: string;
}

export interface ReferralDetails {
    _id: string;
    user: string;
    referralCode: string;
    referCount: number;
    totalPoints: number;
    tradePoints: number;
    referPoints: number;
    createdAt: string;
    updatedAt: string;
    position: number;
}
