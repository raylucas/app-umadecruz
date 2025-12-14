import axios from "axios";
import Constants from "expo-constants";
import { getToken } from "./auth";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ??
  "https://app-umadecruz-backend.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchUserById = async (userId: number) => {
  try {
    const response = await api.get(`/usuario/id/${userId}`);
    return response.data; 
  } catch (error: any) {
    console.error("Falha ao buscar usuário:", error.response?.data ?? error.message);
    throw error; 
  }
};

export default api;
