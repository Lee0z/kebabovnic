import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const get = (url, config = {}) => apiClient.get(url, config).then(response => response.data);
export const post = (url, data, config = {}) => apiClient.post(url, data, config).then(response => response.data);
export const put = (url, data, config = {}) => apiClient.put(url, data, config).then(response => response.data);
export const del = (url, config = {}) => apiClient.delete(url, config).then(response => response.data);
export const patch = (url, data, config = {}) => apiClient.patch(url, data, config).then(response => response.data);
