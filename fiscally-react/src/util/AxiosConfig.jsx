import axios from 'axios'
import { BASE_URL } from './apiEndPoints';

const AxiosConfig = axios.create({
    // ✅ FIX: Changed 'baseUrl' to 'baseURL' (Capital URL is required)
    baseURL: BASE_URL, 
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// list of endpoints that do not require authorization header
const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

// Request Interceptor
AxiosConfig.interceptors.request.use((config) => {
    // ✅ FIX: Added 'return' so the logic actually works
    const skipToken = excludeEndpoints.some((endpoint) => {
        return config.url?.includes(endpoint);
    });

    if (!skipToken) {
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

// Response Interceptor
// ✅ FIX: Attached to 'AxiosConfig' instead of global 'axios'
AxiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            window.location.href = "/login";
        } else if (error.response.status === 500) {
            console.log("Server error. Please Try Again later");
        }
    } else if (error.code === "ECONNABORTED") {
        console.log("Request timeout. Please try again");
    }
    return Promise.reject(error)
})

export default AxiosConfig;