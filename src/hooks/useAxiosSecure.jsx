import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecureInstance = axios.create({
  baseURL: "http://localhost:5000",
});

export default function useAxiosSecure() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

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

  axiosSecureInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.status === 403) {
        // Handle unauthorized or forbidden access message
        navigate("/unauthorized");
      } else if (error.status === 401) {
        // access token is expired or invalid
        signOutUser()
          .then(() => {
            navigate("/login");
          })
          .catch(() => {});
      }

      return Promise.reject(error);
    },
  );

  return axiosSecureInstance;
}
