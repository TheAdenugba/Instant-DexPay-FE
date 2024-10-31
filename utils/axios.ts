import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Adding Authorization header for all requests
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || '';
        if (token) {
            config.headers!["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;

        if (error?.response?.status === 401 && !config?.sent) {
            config.sent = true;

            const refreshToken = localStorage.getItem("refreshToken");
            const token = localStorage.getItem("token");
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/refresh-token`,
                    {
                        refreshToken: refreshToken,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'refreshToken': refreshToken
                        }
                    }
                );
                if (response) {
                    localStorage.setItem("token", response.data.accessToken);
                    axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
                    config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    return axios(config);
                }
            } catch (error) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("refreshToken");
                window.localStorage.removeItem("defaultAsset");
                console.log(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
