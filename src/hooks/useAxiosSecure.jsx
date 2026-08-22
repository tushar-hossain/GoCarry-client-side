import axios from "axios";

const axiosSecureInstance = axios.create({
  baseURL: "http://localhost:5000",
});

export default function useAxiosSecure() {
  return axiosSecureInstance;
}
