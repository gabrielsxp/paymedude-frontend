import axios from 'axios';
import { getToken } from "./services/auth";
const baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1';
const port = process.env.REACT_APP_API_URL_PORT || '3001';
const instance = axios.create({
    baseURL: `${baseURL}:${port}`
});

instance.headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    "Access-Control-Allow-Origin": "*"
}

instance.interceptors.request.use(async config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error.response.data.error);
});

export default instance;