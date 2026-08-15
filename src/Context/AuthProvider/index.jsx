import { AuthContext } from "../AuthContext";

export default function AuthProvider({ children }) {
  const authInfo = {};

  return <AuthContext value={authInfo}>{children}</AuthContext>;
}
