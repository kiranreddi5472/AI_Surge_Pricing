import axios from 'axios';

// Base URL for our Django backend API
const API_URL = 'http://localhost:8000/api';

// Create an Axios instance with default headers
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const predictPrice = async (data) => {
    try {
        const response = await api.post('/predict-price/', data);
        return response.data;
    } catch (error) {
        console.error("Error predicting price:", error);
        throw error;
    }
};

export const fetchHistory = async () => {
    try {
        const response = await api.get('/history/');
        return response.data;
    } catch (error) {
        console.error("Error fetching history:", error);
        throw error;
    }
};
