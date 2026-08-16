import useAuth from "@/hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const { createUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Set display name
        await updateProfile(user, {
          displayName: data.name,
        });

        navigate("/");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div className="w-3/4 mx-auto">
      <div>
        {/* Heading */}
        <div className="mb-4">
          <h1 className="text-[23px] font-bold leading-[34px] tracking-[-0.7px] text-black">
            Create an Account
          </h1>

          <p className="mt-1 text-[9px] text-black">Register with GoCarry</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-[10px] font-medium text-[#18181B]"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`h-[29px] w-full rounded-[4px] border bg-white px-2 text-[10px] outline-none placeholder:text-[#94A3B8] focus:border-[#CAEB66] ${
                errors.name ? "border-red-400" : "border-[#D9E0E5]"
              }`}
            />

            {errors?.name && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`h-[29px] w-full rounded-[4px] border bg-white px-2 text-[10px] outline-none placeholder:text-[#94A3B8] focus:border-[#CAEB66] ${
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`h-[29px] w-full rounded-[4px] border bg-white px-2 text-[10px] outline-none placeholder:text-[#94A3B8] focus:border-[#CAEB66] ${
                errors.password ? "border-red-400" : "border-[#D9E0E5]"
              }`}
            />

            {errors?.password && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="mt-1 h-[29px] w-full cursor-pointer rounded-[4px] bg-[#CAEB66] text-[10px] font-medium text-black transition hover:brightness-95"
          >
            Register
          </button>

          {/* Login */}
          <p className="pt-[1px] text-[10px] text-[#71717A]">
            Already have an account?{" "}
            <Link to={"/login"}>
              <button
                type="button"
                className="cursor-pointer text-[#8FA748] hover:underline"
              >
                Login
              </button>
            </Link>
          </p>

          {/* Or */}
          <div className="flex items-center justify-center py-[2px]">
            <span className="text-[10px] text-[#71717A]">Or</span>
          </div>

          {/* Google Register */}
          <button
            type="button"
            className="flex h-[29px] w-full cursor-pointer items-center justify-center gap-1 rounded-[4px] bg-[#E9EDF2] text-[10px] font-medium text-black transition hover:bg-[#e1e5ea]"
          >
            <span className="text-[12px] font-bold text-[#4285F4]">G</span>
            Register with google
          </button>
        </form>
      </div>
    </div>
  );
}
