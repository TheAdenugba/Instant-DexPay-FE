export interface ExpressOrderDataState {
    amount: string;
    amountToReceive: string;
    fiat: string;
    asset: string;
    price: number | null;
    paymentMethod: string;
    orderType: string;
    firstName: string;
    lastName: string
    paymentAccountId: string;
    serviceFee: string;
    inputField: string;
    walletAddress: string;
}
export interface TradePostDataState {
    _id: string;
    type: string;
    paymentAccountId: string;
    fiat: string;
    price: number | null;
    quantity: number | null;
    minLimit: number | null;
    maxLimit: number | null;
    paymentTime: number | null;
    instruction: string;
    asset: string;
    serviceFee: string;
    quantityAvailable: number | null;
    priceType: "MANUAL" | "AUTO";
    percentToMarketPrice: string;
    prefix: string;
    minPriceLimit: number | null;
    maxPriceLimit: number | null;
    walletAddress: string;
}

export interface ReqObj {
    message: {
        from: string;
        nonce: string;
        to: string;
        validUntil: string;
    };
    signature: string;
}

export interface Country {
    id: string;
    name: string;
    code: string;
    currencyCode: string;
    currencyName: string;
    currencySymbol: string;
}
