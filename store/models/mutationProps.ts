export type IAuthenticate = {
    publicAddress: unknown,
    signature: unknown,
    message: unknown,
}
export type ISocialLogin = {
    publicAddresses: unknown;
    emailAddress: unknown;
    referredBy: string;
    dlToken: unknown;
}

export type ICreateUser = {
    publicAddress: unknown,
    signature: unknown,
    message: unknown,
    emailAddress: string,
    referredBy: unknown,
}