import apiClient from './api.client';

export const getEvents = async (data: any) => {
    try {
        const response = await apiClient.post(`/chat/events`, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching leads', error);
        throw error;
    }
};
