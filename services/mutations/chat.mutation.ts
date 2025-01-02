import axiosClient from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface IConfirmPayment {
    signature: unknown
    message: unknown
}
export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ message, orderId }: { message: string, orderId: string }) => {
            const req = await axiosClient.post(`/trades/order/${orderId}/message`, { message })
            return req
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['receive_message'] });
        },
    })
}

export const useReceiveMessage = (orderId: string) => {
    return useQuery({
        queryKey: ['receive_message'],
        queryFn: async () => {
            const res = await axiosClient.get(`/trades/order/${orderId}/message`)
            return res
        },
        enabled: !!orderId,
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
    })
}

export const useGetOrderById = (orderId: string) => {
    return useQuery({
        queryKey: ['order_by_id', orderId],
        queryFn: async () => {
            const res = await axiosClient.get(`/trades/order/${orderId}`)
            return res
        },
        enabled: !!orderId
    })
}

// set all messages to read
export const useClearMessageCount = () => {
    return useMutation({
        mutationFn: async ({ orderId }: { orderId: string }) => {
            const req = await axiosClient.put(`/trades/order/${orderId}/message`)
            return req
        },
    })
}

export const useConfirmPayment = (orderId: string) => {
    return useMutation({
        mutationFn: async ({ data }: { data: IConfirmPayment }) => {
            const req = await axiosClient.post(`/trades/order/${orderId}/pay`, { ...data })
            return req
        }
    })
}

export const useCancelTrade = (orderId: string) => {
    return useMutation({
        mutationFn: async ({ data }: { data: IConfirmPayment }) => {
            const req = await axiosClient.post(`/trades/order/${orderId}/cancel`, { ...data })
            return req
        }
    })
}

export const useCreateTradeDispute = (orderId: string) => {
    return useMutation({
        mutationFn: async ({ reason }: { reason: string }) => {
            const req = await axiosClient.post(`/trades/order/${orderId}/dispute`, { reason })
            return req
        }
    })
}

export const useConfirmReceivedSoldPayment = (orderId: string) => {
    return useMutation({
        mutationFn: async ({ data }: { data: IConfirmPayment }) => {
            const req = await axiosClient.post(`/trades/order/${orderId}/confirm`, { ...data })
            return req
        }
    })
}