import useAuth from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function GoogleRegister() {
  const { signInWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Save user information to database
      const userInfo = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      };

      await axiosPublic.post("/users", userInfo);

      await Swal.fire({
        icon: "success",
        title: "Login successful",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (error) {
      console.error(error.message);
      Swal.fire({
        icon: "error",
        title: "Google login failed",
        text: "Something went wrong.",
        showConfirmButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="flex h-7.25 w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#CAEB66] text-[10px] font-medium text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <FcGoogle size={16} />
            Login with Google
          </>
        )}
      </button>
    </div>
  );
}
