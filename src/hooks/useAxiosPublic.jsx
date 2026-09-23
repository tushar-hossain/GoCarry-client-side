import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://go-carry-server-side.vercel.app",
});

export default function useAxiosPublic() {
  return axiosPublic;
}
