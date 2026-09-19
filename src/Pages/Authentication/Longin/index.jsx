import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

import GoogleRegister from "../Components/GoogleRegister";

export default function Login() {
  const { signInUser } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const userCredential = await signInUser(data.email, data.password);
      const user = userCredential.user;
      if (user) {
        await Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate(location?.state || "/");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Invalid email or password.",
        showConfirmButton: true,
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
            Welcome Back
          </h1>

          <p className="mt-1 text-[9px] text-black">Login with GoCarry</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Email */}
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-[10px] font-medium text-[#18181B]"
            >
              Password
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

          {/* Forgot Password */}
          <div className="pt-px">
            <button
              type="button"
              disabled={isLoading}
              className="cursor-pointer text-[10px] text-[#71717A] hover:underline disabled:cursor-not-allowed"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-7.25 w-full items-center justify-center gap-1 rounded-lg bg-[#CAEB66] text-[10px] font-medium text-black cursor-pointer transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Register */}
          <p className="pt-px text-[10px] text-[#71717A]">
            Don't have any account?{" "}
            <Link to="/register">
              <button
                type="button"
                disabled={isLoading}
                className="cursor-pointer text-black hover:underline"
              >
                Register
              </button>
            </Link>
          </p>

          {/* Or */}
          <div className="flex items-center justify-center py-0.5">
            <span className="text-[10px] text-black">Or</span>
          </div>

          {/* Google Login */}
          <GoogleRegister />
        </form>
      </div>
    </div>
  );
}
