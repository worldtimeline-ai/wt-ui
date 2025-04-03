import axios from 'axios';
import axiosRetry from 'axios-retry';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { KEYS } from '../constants/keys';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_WT_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosRetry(apiClient, {
    retries: 2,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => error.code === 'ECONNABORTED' || axiosRetry.isNetworkOrIdempotentRequestError(error),
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error(error)
        if (error?.response?.status === 401) {
            // window.location = "/logout";
        }
        throw error;
    },
);

const refreshAuthLogic = async (failedRequest: any) => {
    try {
        const refresh_token = localStorage.getItem(KEYS.REFRESH_TOKEN) || '';
        const response = await axios.post(`${process.env.NEXT_PUBLIC_WT_API_BASE_URL}/api/v1/auth/renew-token`, {
            refresh_token,
        });
        console.log('renew token response', response);
        const accessToken = response.data?.access_token;
        localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
        failedRequest.response.config.headers.Authorization = `${accessToken}`;
        return Promise.resolve();
    } catch (err) {
        // window.location = "/logout";
    }
};

createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
    shouldRefresh: (error) => {
        console.log('error response', error.response);
        return error?.response?.data === 'Access denied' && error?.response?.status === 403;
    },
    interceptNetworkError: false,
    retryInstance: apiClient,
    pauseInstanceWhileRefreshing: true,
});

export default apiClient;
