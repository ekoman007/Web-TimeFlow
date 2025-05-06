// services/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with proper configuration
const axiosClient = axios.create({
  baseURL: '/api',  // proxy handles the redirection to the backend
  withCredentials: true, // Important for sending the refreshToken cookie
  headers: {
    'Content-Type': 'application/json',
  },
  // For development only - ignores certificate validation
  // WARNING: This should be removed in production
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: false
  })
});

// Request Interceptor: Add Authorization header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Handle server-side rendering where localStorage isn't available
    let accessToken = null;
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('accessToken');
    }
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variable to prevent infinite refresh loops
let isRefreshing = false;
// Array to hold subscribers that are waiting for the new token
let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!); // Assert token is not null if error is null
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 errors and refresh token
axiosClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    return response;
  },
  async (error: AxiosError) => {
    console.log('API Error:', error.message);
    
    // Don't attempt to refresh token if there's a network error
    if (!error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if it's a 401 error and not already a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If already refreshing, queue the original request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers!['Authorization'] = 'Bearer ' + token;
          return axiosClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true; // Mark as retry
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post<{ success: boolean; accessToken: string; message?: string }>(
          '/api/Login/refresh-token', // Path to refresh token endpoint
          {}, 
          { 
            withCredentials: true, // Send the refreshToken cookie
            // Skip certificate validation for development
            httpsAgent: new (require('https').Agent)({
              rejectUnauthorized: false
            })
          }
        );

        if (refreshResponse.data.success) {
          const newAccessToken = refreshResponse.data.accessToken;
          console.log("Token refresh successful");
          
          // Store the new token
          localStorage.setItem('accessToken', newAccessToken);
          
          // Update auth headers
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers!['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Process queued requests with new token
          processQueue(null, newAccessToken);
          
          // Retry the original request
          return axiosClient(originalRequest);
        } else {
          // If refresh fails server-side
          console.error('Token refresh failed:', refreshResponse.data.message);
          localStorage.removeItem('accessToken');
          
          // Handle failed refresh
          processQueue(new Error(refreshResponse.data.message || 'Refresh token failed'), null);
          
          // Redirect to login page
          window.location.href = '/page/login';
          return Promise.reject(new Error(refreshResponse.data.message || 'Refresh token failed'));
        }
      } catch (refreshError: any) {
        // If the refresh API call itself fails
        console.error('Error during token refresh:', refreshError);
        localStorage.removeItem('accessToken');
        
        // Redirect to login
        window.location.href = '/page/login';
        
        // Handle failed refresh
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For errors other than 401, or if it's already a retry, reject
    return Promise.reject(error);
  }
);

export default axiosClient;
