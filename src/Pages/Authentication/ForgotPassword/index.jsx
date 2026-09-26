import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await axiosPublic.post("/auth/forgot-password", {
        email: data.email,
      });

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "OTP sent",
          text: "Please check your email for the 6 digit verification code.",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/otp-code", {
          state: {
            email: data.email,
          },
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed to send OTP",
        text:
          error?.response?.data?.message ||
          "Please check your email and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-3/4 mx-auto">
      <div>
        {/* Heading */}
        <div className="mb-3">
          <h1 className="text-[23px] font-bold leading-7 tracking-[-0.5px] text-black">
            Forgot Password
          </h1>

          <p className="mt-1 text-[9px] text-black">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-[10px] font-medium text-[#18181B]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Email"
              disabled={isLoading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`h-7.25 w-full rounded-lg border bg-white px-2 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] disabled:cursor-not-allowed disabled:bg-gray-100 ${
                errors.email ? "border-red-400" : "border-[#D9E0E5]"
              }`}
            />

            {errors?.email && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-7.25 w-full items-center justify-center gap-1 rounded-lg bg-[#CAEB66] text-[10px] font-medium text-black cursor-pointer transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>

          {/* Back to Login */}
          <p className="pt-px text-[10px] text-[#71717A]">
            Remember your password?{" "}
            <Link to="/login">
              <button
                type="button"
                disabled={isLoading}
                className="cursor-pointer text-black hover:underline"
              >
                Login
              </button>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
