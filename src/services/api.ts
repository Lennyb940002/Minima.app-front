export const salesApi = {
    getAllSales: async (): Promise<Sale[]> => {
        try {
            const response = await api.get<Sale[]>('/');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des ventes :', error);
            throw error;
        }
    },

    getSalesAnalytics: async (): Promise<any> => {
        try {
            const response = await api.get<any>('/analytics');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des analytics des ventes :', error);
            throw error;
        }
    },

    createSale: async (sale: Omit<Sale, '_id'>): Promise<Sale> => {
        try {
            const response = await api.post<Sale>('/', sale);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la vente :', error);
            throw error;
        }
    },

    updateSale: async (id: string, sale: Partial<Omit<Sale, '_id'>>): Promise<Sale> => {
        try {
            const response = await api.put<Sale>(`/${id}`, sale);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la vente :', error);
            throw error;
        }
    },

    updateDecStatus: async (id: string): Promise<Sale> => {
        try {
            const response = await api.patch<Sale>(`/${id}/decstatus`, {
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
            await api.delete(`/${id}`);
        } catch (error) {
            console.error('Erreur lors de la suppression de la vente :', error);
            throw error;
        }
    },
};
