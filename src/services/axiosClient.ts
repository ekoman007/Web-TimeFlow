// services/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',      // proxy to https://localhost:7088/api
  withCredentials: true, // cookies will flow
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
