// utils/authAxiosInstance.ts
import axiosClient from './axiosClient';

export async function authAxiosInstance<T = any>(
  url: string,
  options: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> } = {}
): Promise<T> {
  let accessToken = localStorage.getItem('accessToken');

  try {
    // 🔐 Kërkesa fillestare me token aktual
    const response = await axiosClient.request<T>({
      url,
      method: options.method as any || 'GET',
      data: options.body,
      headers: {
        ...options.headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    return response.data;

  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // 🔄 Refresh token nëse 401
        const refreshRes = await axiosClient.post<{
          success: boolean;
          accessToken: string;
        }>('/Login/refresh-token', null);

        if (refreshRes.data.success) {
          accessToken = refreshRes.data.accessToken;
          localStorage.setItem('accessToken', accessToken);

          // 🔁 Riproq kërkesën me token-in e ri
          const retry = await axiosClient.request<T>({
            url,
            method: options.method as any || 'GET',
            data: options.body,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return retry.data;
        } else {
          // Nëse refresh nuk funksionon — redirect ose error
          throw new Error('Unable to refresh token');
        }
      } catch (refreshError) {
        // Nëse edhe refresh dështon — çfardo veprimi (logout, redirect)
        localStorage.removeItem('accessToken');
        throw refreshError;
      }
    }

    // Hedh error-in për çdo rast tjetër
    throw err;
  }
}
