import { axiosInstance } from '@/providers/data/axios'; // Update this import path as needed

axiosInstance.defaults.baseURL = 'https://argo-ai-llm-lzkpo.ondigitalocean.app/';

const API_BASE_URL = '/api/v1/emissionFactors';

export interface EmissionFactorData {
    name: string;
    co2: number;
    co2_unit: string;
    ch4: number;
    ch4_unit: string;
    n2o: number;
    n2o_unit: string;
    source: string;
    link: string;
    scope: number;
    document_id: string;
    description: string;
}

export const emissionFactorService = {
    addOne: async (data: EmissionFactorData) => {
        const response = await axiosInstance.post(`${API_BASE_URL}/addOne`, data);
        return response.data;
    },

    updateOne: async (data: EmissionFactorData) => {
        const response = await axiosInstance.post(`${API_BASE_URL}/updateOne`, data);
        return response.data;
    },

    deleteOneEFById: async (id: string) => {
        const response = await axiosInstance.delete(`${API_BASE_URL}/deleteOneEFById`,{
            params: { document_id: id }
        });
        return response.data;
    },

    getAll: async () => {
        const response = await axiosInstance.get(`${API_BASE_URL}/getAll`);
        return response.data;
    },
}