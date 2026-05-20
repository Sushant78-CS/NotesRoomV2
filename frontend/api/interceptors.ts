import { AxiosError, AxiosRequestConfig } from "axios";
import { api } from "./client";
import { useAuth } from "@clerk/expo"

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

let getToken: (() => Promise<string | null>) | null = null;

export const setupInterceptors = (
    tokenGetter: () => Promise<string | null>,
) => {
    getToken = tokenGetter;
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        console.log("Response error status =>", error.response?.status);
        console.log("Request URL =>", originalRequest?.url);

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const accessToken = await getToken?.();
                if (!accessToken) {
                    console.log("No access token found, clearing and rejecting");
                    return Promise.reject(error);
                }

                api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                }

                return api(originalRequest);
            } catch (err) {
                console.log("Critical Auth Failure", err);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    },
);

api.interceptors.request.use(async (config) => {
    const token = await getToken?.();

    if (!config.headers) {
        config.headers = {} as any;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("INTERCEPTOR HIT");
    console.log("FINAL TOKEN USED =>", token);
    console.log("FINAL HEADERS =>", config.headers);
    return config;
});
