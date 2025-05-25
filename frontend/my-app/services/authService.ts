// services/authService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; // replace with actual IP

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, { email, password });
  return response.data;
};
