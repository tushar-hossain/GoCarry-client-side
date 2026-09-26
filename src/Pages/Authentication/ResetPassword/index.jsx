import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    if (isLoading) return;

    if (!email || !resetToken) {
      Swal.fire({
        icon: "error",
        title: "Invalid reset session",
        text: "Please start the password reset process again.",
      });

      navigate("/forgot-password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosPublic.post("/auth/reset-password", {
        email,
        resetToken,
        password: data.password,
      });

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Password reset successful",
          text: "You can now login with your new password.",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/login");
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Reset failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
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
            Reset Password
          </h1>

          <p className="mt-1 text-[9px] text-black">Reset your password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-[10px] font-medium text-[#18181B]"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Password"
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`h-7.25 w-full rounded-lg border bg-white px-2 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] disabled:cursor-not-allowed disabled:bg-gray-100 ${
                errors.password ? "border-red-400" : "border-[#D9E0E5]"
              }`}
            />

            {errors?.password && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-[10px] font-medium text-[#18181B]"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Password"
              disabled={isLoading}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`h-7.25 w-full rounded-lg border bg-white px-2 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] disabled:cursor-not-allowed disabled:bg-gray-100 ${
                errors.confirmPassword ? "border-red-400" : "border-[#D9E0E5]"
              }`}
            />

            {errors?.confirmPassword && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Reset */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-7.25 w-full items-center justify-center gap-1 rounded-lg bg-[#CAEB66] text-[10px] font-medium text-black cursor-pointer transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
