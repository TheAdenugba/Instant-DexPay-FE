import axiosClient from "@/utils/axios";
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from "axios";

export const useHandleBestRate = () => {
    return useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async ({ asset, data }: { asset: string, data: any }) => {
            const req = await axiosClient.post(`/trades/express/${asset}`, { ...data })
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