import axios, { AxiosError, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { getSession, signOut } from "next-auth/react";

const axiosClient = axios.create({
  baseURL: process.env.Backend_URL,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: AxiosResponse)=> void;
  reject: (error: AxiosError)=> void;
}[] = [];

const processQueue = (error: AxiosError | null, response?: AxiosResponse) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (response) {
      prom.resolve(response);
    }
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  const session = await getSession();
  const refreshToken = session?.backendToken?.refreshToken;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const decodedToken = jwtDecode<{ exp: number }>(refreshToken);
  if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Refresh token has expired");
  }

  const response = await axios.post("/user/auth/refresh", null, {
    headers: {
      Authorization: `Refresh ${refreshToken}`,
    },
  });

  return response.data.accessToken;
};

// Request interceptor
axiosClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  const accessToken = session?.backendToken?.accessToken;

  if (!accessToken) {
    throw new Error("No access token available");
  }

  const decodedToken = jwtDecode<{ exp: number }>(accessToken);
  if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Access token has expired");
  }

  (config.headers as any).Authorization = `Bearer ${accessToken}`;
  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // @ts-ignore
    if (error.response?.status === 401 && !originalRequest._retry) {
      // @ts-ignore
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (res) => resolve(res),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();
        if(!originalRequest){
          throw new Error("Original request is undefined");
        }
        // Update the original request with the new token
        (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;

        const response = await axiosClient(originalRequest);

        processQueue(null, response);
        return response;
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError);
        await signOut({ redirect: false });
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
