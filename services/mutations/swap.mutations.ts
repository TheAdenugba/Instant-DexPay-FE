import axiosClient from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from "axios";

export enum CHANNEL {
    BANK_TRANSFER = 'BANK_TRANSFER',
    MOBILE_MONEY = 'MOBILE_MONEY'
}
export type IPayment = {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string,
    paymentChannel: CHANNEL,
    isDefault: boolean
}

export interface IExpressTrade {
    type: string;
    asset: string;
    signatureMessage: unknown;
    quantity: number;
    paymentAccountId: string;
}
export const useHandleBestRate = () => {
    return useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async ({ asset, data }: { asset: string, data: any }) => {
            const req = await axiosClient.post(`/trades/express/best`, { asset, ...data })
            return req
        },
    })
}

export const useGetRefreshRate = () => {
    return useMutation({
        mutationFn: async ({ asset, orderType }: { asset: string, orderType: string }) => {
            const req = await axiosClient.get(`/trades/express/${asset}/${orderType}`)
            return req
        },
    })
}

export const useGetAmountToReceive = () => {
    return useMutation({
        mutationFn: async ({ asset, orderType }: { asset: string, orderType: string }) => {
            const req = await axiosClient.get(`/trades/express/${asset}/${orderType}`)
            return req
        },
    })
}


export const useGetTradeFee = () => {
    return useQuery({
        queryKey: ['get_trade_fee'],
        queryFn: async () => {
            const res = await axiosClient.get(`/trades/fee`)
            return res
        },
    })
}

export const useFetchIp = () => {
    return useQuery({
        queryKey: ['ip'],
        queryFn: async () => {
            const res = await axios.get("https://geolocation-db.com/json/")
            return res.data.IPv4
        },
    })
}

export const useGetCurrencyByIp = (ipAddress: string) => {
    return useQuery({
        queryKey: ['get_currency_ip', ipAddress],
        queryFn: async () => {
            const res = await axiosClient.get(`/trades/fee/${ipAddress}`)
            return res.data
        },
    })
}

export const useFetchAssets = () => {
    return useQuery({
        queryKey: ['fetch_asset'],
        queryFn: async () => {
            const res = await axiosClient.get(`/assets`)
            return res.data
        },
    })
}

export const useFetchCurrencies = () => {
    return useQuery({
        queryKey: ['fetch_currency'],
        queryFn: async () => {
            const res = await axiosClient.get(`/trades/country-currency`)
            return res.data
        },
    })
}

export const useFetchBanks = () => {
    return useQuery({
        queryKey: ['fetch_banks'],
        queryFn: async () => {
            const res = await axiosClient.get(`/payments/banks`)
            return res.data
        },
    })
}

export const useFetchPaymentAcct = () => {
    return useQuery({
        queryKey: ['fetch_accounts'],
        queryFn: async () => {
            const res = await axiosClient.get(`/payments`)
            return res.data
        },
    })
}

export const useCreatePaymentAccount = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: IPayment) => {
            const req = await axiosClient.post(`/payments`, { ...data })
            return req
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetch_accounts'] })
        }
    })
}

export const useResolveAccount = () => {
    return useMutation({
        mutationFn: async ({ accountNumber, bankCode }: { accountNumber: string, bankCode: string }) => {
            const req = await axiosClient.post(`/payments/resolve-account`, { accountNumber, bankCode })
            return req
        },
    })
}

export const useTradeExpressOrder = () => {
    return useMutation({
        mutationFn: async (data: Partial<IExpressTrade>) => {
            const req = await axiosClient.post(`/trades/express/create`, { ...data })
            return req
        },
    })
}

export const useTradeTopUp = () => {
    return useMutation({
        mutationFn: async () => {
            const req = await axiosClient.post(`/trades/top-up`)
            return req
        },
    })
}


