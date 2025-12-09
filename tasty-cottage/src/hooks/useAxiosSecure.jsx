import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";


const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    
    const requestInterceptor = axiosSecure.interceptors.request.use(
      function (config) {
        const token = localStorage.getItem('access-token');
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    
    const responseInterceptor = axiosSecure.interceptors.response.use(
      function (response) {
        return response;
      },
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, logOut]);

  return axiosSecure;
};

export default useAxiosSecure;