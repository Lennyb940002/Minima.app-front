// Front-end: api/salesApi.ts
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BACKEND_URL}/api/sales`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Modification critique 1: Assurer que le token est envoyé dans chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Important: format 'Bearer'
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Modification critique 2: Gérer l'expiration du token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const salesApi = {
    getAllSales: async () => {
        try {
            const response = await api.get('');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des ventes:', error);
            throw error;
        }
    }
};
