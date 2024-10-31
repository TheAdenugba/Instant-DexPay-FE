import { IAuthenticate, ICreateUser, ISocialLogin } from "@/store/models/mutationProps";
import axiosClient from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// MUTATION CALLS
export const useHandleSocialLogin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: ISocialLogin) => {
            const res = await axiosClient.post("/dynamic-login", data);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dynamic_login'] })
        }
    })
}

export const useAuthenticateAddress = () => {
    // const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: IAuthenticate) => {
            const req = await axiosClient.post('/authenticate-address', { ...data })
            return req
        }
    })
}

export const useRequestOtp = () => {
    return useMutation({
        mutationFn: async (publicAddress: unknown) => {
            const req = await axiosClient.post(`/request-otp/${publicAddress}`, { publicAddress: publicAddress, })
            return req
        }
    })
}

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: async ({ otp, publicAddress }: { otp: number, publicAddress: unknown }) => {
            const req = await axiosClient.post(`/verify-email`, { publicAddress, otp })
            return req
        }
    })
}

export const useHandleCreateUser = () => {
    return useMutation({
        mutationFn: async (data: ICreateUser) => {
            const req = await axiosClient.post('/create-user', { ...data })
            return req
        }
    })
}


//   QUERY CALLS
export const useGetNonce = (publicAddress: unknown) => {
    return useQuery({
        queryKey: ['get_nonce', publicAddress],
        queryFn: async () => {
            const res = await axiosClient.get(`/get-nonce/${publicAddress}`)
            return res
        },
        enabled: !!publicAddress
    })
}

export const useGetAddress = (publicAddress: unknown) => {
    return useQuery({
        queryKey: ['get_address', publicAddress],
        queryFn: async () => {
            const res = await axiosClient.get(`/check-address/${publicAddress}`)
            return res
        },
        enabled: !!publicAddress
    })
}

export const useGetProfile = () => {
    return useQuery({
        queryKey: ['get_profile'],
        queryFn: async () => {
            const res = await axiosClient.get(`/profile`)
            return res
        },
    })
}

