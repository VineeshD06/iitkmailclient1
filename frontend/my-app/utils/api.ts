import axios from 'axios';
import { BASE_URL } from '../constants/config';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${BASE_URL}/login`, { email, password });
  return res.data;
};

export const fetchInbox = async (email: string, password: string) => {
  const res = await axios.post(`${BASE_URL}/inbox`, { email, password });
  return res.data;
};

export const sendMail = async (email: string, password: string, to: string, subject: string, text: string) => {
  const res = await axios.post(`${BASE_URL}/send`, {
    email,
    password,
    to,
    subject,
    text,
  });
  return res.data;
};
