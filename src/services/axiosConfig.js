import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

// Handle token expiration or invalid tokens
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; // redirect to login if expired
    }
    return Promise.reject(error);
  }
);

// Pass through authentication token in axios requests
export const fetchWithAuth = async (getAccessTokenSilently, url, method = 'GET', data = null) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await instance({
      method,
      url,
      data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching API:", error);
    return null;
  }
};

export default instance;
