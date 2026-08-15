import { useForm } from "react-hook-form";
import { Link } from "react-router";

export default function Login() {
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

  const onSubmit = (data) => {
    console.log("Login data:", data);
  };

  return (
    <div className="w-3/4 mx-auto">
      <div>
        {/* Heading */}
        <div className="mb-3">
          <h1 className="text-[23px] font-bold leading-[28px] tracking-[-0.5px] text-black">
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`h-[29px] w-full rounded-[4px] border bg-white px-2 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] ${
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
              className={`h-[29px] w-full rounded-[4px] border bg-white px-2 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] ${
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
          <div className="pt-[1px]">
            <button
              type="button"
              className="text-[10px] text-[#71717A] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="h-[29px] w-full rounded-[4px] bg-[#CAEB66] text-[10px] font-medium text-black transition hover:brightness-95 cursor-pointer"
          >
            Login
          </button>

          {/* Register */}
          <p className="pt-[1px] text-[10px] text-[#71717A]">
            Don't have any account?{" "}
            <Link to={"/register"}>
              <button
                type="button"
                className="text-[#8FA748] hover:underline cursor-pointer"
              >
                Register
              </button>
            </Link>
          </p>

          {/* Or */}
          <div className="flex items-center justify-center py-[2px]">
            <span className="text-[10px] text-[#71717A]">Or</span>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="flex h-[29px] w-full items-center justify-center gap-1 rounded-[4px] bg-[#E9EDF2] text-[10px] font-medium text-black transition hover:bg-[#e1e5ea] cursor-pointer"
          >
            <span className="text-[10px] font-bold text-[#4285F4]">G</span>
            Login with google
          </button>
        </form>
      </div>
    </div>
  );
}
