import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "http://192.168.0.164:8080",
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
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
