import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT Auth Token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('csm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// AUTH API
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const loginGuestUser = (data) => API.post('/auth/guest', data);
export const getCurrentUser = () => API.get('/auth/me');

// EXAM & QUESTION BANK API
export const fetchQuestions = (params) => API.get('/exam/questions', { params });
export const fetchDomains = () => API.get('/exam/domains');
export const uploadExcelQuestionBank = (formData) => API.post('/exam/upload-excel', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// SESSION RESULTS & HISTORY API
export const submitExamSession = (data) => API.post('/sessions/submit', data);
export const fetchUserSessions = () => API.get('/sessions/my-sessions');
export const fetchSessionDetail = (id) => API.get(`/sessions/detail/${id}`);
export const fetchUserAnalytics = () => API.get('/sessions/analytics');

export default API;
