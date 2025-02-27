import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

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
