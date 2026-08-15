import { AuthContext } from "@/Context/AuthContext";
import { use } from "react";

export default function useAuth() {
  const authInfo = use(AuthContext);
  return authInfo;
}
