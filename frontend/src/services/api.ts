import axios, { type AxiosInstance } from 'axios';
import type { Stock, ScreeningCriteria, ApiResponse } from '../types';

let apiClient: AxiosInstance | null = null;

const getClient = (): AxiosInstance => {
    if (!apiClient) {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        console.log('API Service: Initializing client with base URL:', API_BASE_URL);
        apiClient = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    return apiClient;
};

export const apiService = {
    async getAllStocks(): Promise<ApiResponse<Stock[]>> {
        const client = getClient();
        const response = await client.get<ApiResponse<Stock[]>>('/stocks/all');
        return response.data;
    },

    async screenStocks(criteria: ScreeningCriteria): Promise<ApiResponse<Stock[]>> {
        const client = getClient();
        const response = await client.post<ApiResponse<Stock[]>>('/stocks/screen', criteria);
        return response.data;
    },

    async checkHealth(): Promise<{ status: string }> {
        const client = getClient();
        const response = await client.get('/health');
        return response.data;
    }
};
