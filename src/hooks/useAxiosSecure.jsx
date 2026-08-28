import axios from "axios";
import useAuth from "./useAuth";

const axiosSecureInstance = axios.create({
  baseURL: "http://localhost:5000",
});

export default function useAxiosSecure() {
  const { user } = useAuth();

  axiosSecureInstance.interceptors.request.use(
    (config) => {
      const token = user?.accessToken;

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  return axiosSecureInstance;
}
