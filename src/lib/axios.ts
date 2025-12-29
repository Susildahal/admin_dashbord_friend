import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth state management
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast({
        title: 'Error',
        description: error.response.data.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      if(error.config.method === 'get'){
        return Promise.resolve({data: null});
      }
      
      
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - redirect to login
          toast({
            title: 'Unauthorized',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive',
          });
          // Robust redirect to /auth
          if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
            window.location.replace('/auth');
          }
          break;
        case 403:
         toast({
              title: 'Forbidden',
              description: 'You do not have permission to access this resource.',
              variant: 'destructive',
            });
          break;
        case 404:
          toast({
              title: 'Not Found',
              description: 'The requested resource was not found.',
              variant: 'destructive',
            });

          break;
        case 500:
          toast({
              title: 'Server Error',
              description: 'An error occurred on the server. Please try again later.',
              variant: 'destructive',
            });       

          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
