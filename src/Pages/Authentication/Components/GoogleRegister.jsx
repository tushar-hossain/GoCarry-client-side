import useAuth from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function GoogleRegister() {
  const { signInWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      signInWithGoogle()
        .then(async (result) => {
          const user = result.user;

          // db save User Information
          const userInfo = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
          };

          await axiosPublic.post("/users", userInfo);

          Swal.fire({
            icon: "success",
            title: "Login successful",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/");
        })
        .catch((error) => {
          console.error(error.message);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSubmit}
        className="flex h-[29px] w-full cursor-pointer items-center justify-center gap-1 rounded-[4px] bg-[#E9EDF2] text-[10px] font-medium text-black transition hover:bg-[#e1e5ea]"
      >
        <FcGoogle size={16} />
        Register with google
      </button>
    </div>
  );
}
