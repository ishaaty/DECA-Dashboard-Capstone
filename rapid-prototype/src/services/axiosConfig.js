import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081', // Your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
