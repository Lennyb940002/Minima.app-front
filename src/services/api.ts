// api/salesApi.ts

import axios from 'axios';
import { Sale } from '../components/sales/types';

// Assurez-vous que l'URL se termine sans slash
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${BACKEND_URL}/api/sales`;

// Création d'une instance axios avec une meilleure gestion des erreurs
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important pour les cookies
});

// Intercepteur pour les requêtes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Log pour le débogage en développement
    if (import.meta.env.DEV) {
        console.log('Request URL:', config.baseURL + config.url);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Gérer l'expiration du token
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const salesApi = {
    getAllSales: async (): Promise<Sale[]> => {
        try {
            const response = await api.get<Sale[]>('');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des ventes:', error);
            throw error;
        }
    },

    getSalesAnalytics: async (): Promise<any> => {
        try {
            const response = await api.get<any>('analytics');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des analytics:', error);
            throw error;
        }
    },

    createSale: async (sale: Omit<Sale, '_id'>): Promise<Sale> => {
        try {
            const response = await api.post<Sale>('', sale);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la vente:', error);
            throw error;
        }
    },

    updateSale: async (id: string, sale: Partial<Omit<Sale, '_id'>>): Promise<Sale> => {
        try {
            const response = await api.put<Sale>(`${id}`, sale);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la vente:', error);
            throw error;
        }
    },

    updateDecStatus: async (id: string): Promise<Sale> => {
        try {
            const response = await api.patch<Sale>(`${id}/decstatus`, {
                decStatus: 2
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du decStatus:', error);
            throw error;
        }
    },

    deleteSale: async (id: string): Promise<void> => {
        try {
            await api.delete(`${id}`);
        } catch (error) {
            console.error('Erreur lors de la suppression de la vente:', error);
            throw error;
        }
    },
};
