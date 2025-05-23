import axios from 'axios';
export const STORAGE_API_URL = 'http://localhost:8000';
export const api = axios.create({
    baseURL: STORAGE_API_URL,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const storageApi = {

    async uploadPhoto(data: FormData): Promise<string> {
        const response = await api.post(`/images`, data, {
            headers: { 
                "Content-Type": "multipart/form-data; charset=utf-8"
            },
        });
        return response.data;
    },

    async getImage(image_url: string) {
        const response = await api.get(image_url);
        return response;
    },
}