import axios from "axios";
import { toast } from "react-toastify";
// import { getI18n } from 'react-i18next';

export interface APIResponse<T> {
  status: boolean;
  data: T;
  message: string;
}

const ax = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
});

// Add a request interceptor
ax.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // const i18n = getI18n();
    // config.headers['Accept-Language'] = i18n.language;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
ax.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data.status === false) {
      toast.error(response.data.message);
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    toast.error(error.response?.data?.message ?? error.message);
    return Promise.reject(error);
  },
);

export default ax;
