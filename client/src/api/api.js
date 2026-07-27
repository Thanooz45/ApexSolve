import axios from 'axios';

const configuredUrl=import.meta.env.VITE_API_URL?.trim();
const baseURL=(configuredUrl||'/api').replace(/\/$/,'');
const api=axios.create({baseURL,timeout:30000});
api.interceptors.request.use(config=>{const token=localStorage.getItem('apex_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config});
api.interceptors.response.use(response=>response,error=>{if(error.response?.status===401){localStorage.removeItem('apex_token');localStorage.removeItem('apex_user')}return Promise.reject(error)});
export default api;
