import axios from 'axios';
import Endpoints from './endpoints'

export const API_URL = "http://158.160.27.120:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

const urlsSkipAuth = [Endpoints.LOGIN];

axiosInstance.interceptors.request.use(async (config) => {
  if (config.url && urlsSkipAuth.includes(config.url)) {
    return config
  }

  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    const authorization = `Bearer ${accessToken}`

    config.headers = {
      ...config.headers,
      Authorization: authorization
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response?.status === 401) && error.config.url !== Endpoints.LOGIN) {
      localStorage.removeItem("token");
      window.location.href = '/auth';
    }
    throw error;
  }
)
