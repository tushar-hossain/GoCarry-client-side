import useAuth from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import GoogleRegister from "../Components/GoogleRegister";

export default function Register() {
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const [uploadImage, setUploadImage] = useState("");
  const axiosPublic = useAxiosPublic();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleUploadPicture = async (e) => {
    const uploadImage = e.target.files[0];
    const formData = new FormData();
    formData.append("image", uploadImage);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData,
      );
      setUploadImage(response?.data?.data?.url);
    } catch (error) {
      console.lerror(error.message);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    createUser(data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Set display name and profile picture
        await updateProfile(user, {
          displayName: data.name,
          photoURL: uploadImage,
        });

        // db save User Information
        const userInfo = {
          uid: user.uid,
          name: data.name,
          email: data.email,
        };

        await axiosPublic.post("/users", userInfo);

        Swal.fire({
          icon: "success",
          title: "Registration successful",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error.message);
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "Registration failed",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-3/4 mx-auto">
      <div>
        {/* Heading */}
        <div className="mb-4">
          <h1 className="text-[23px] font-bold leading-8.5 tracking-[-0.7px] text-black">
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
              className={`h-7.25 w-full rounded-lg border bg-white px-2 text-[10px] outline-none placeholder:text-[#94A3B8] focus:border-[#CAEB66] ${
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
              className={`h-7.25 w-full rounded-lg border bg-white px-2 text-[10px] outline-none placeholder:text-[#94A3B8] focus:border-[#CAEB66] ${
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
              className={`h-7.25 w-full rounded-lg border bg-white px-2 text-[10px] outline-none placeholder:text-[#94A3B8] focus:border-[#CAEB66] ${
                errors.password ? "border-red-400" : "border-[#D9E0E5]"
              }`}
            />

            {errors?.password && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label
              htmlFor="photo"
              className="mb-1 block text-[10px] font-medium text-[#18181B]"
            >
              Profile Picture
            </label>

            <input
              id="photo"
              type="file"
              placeholder="photo"
              onChange={handleUploadPicture}
              className={`h-7.25 w-full cursor-pointer rounded-lg border bg-white px-2 text-[10px] outline-none placeholder:text-[#94A3B8] focus:border-[#CAEB66]}`}
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 h-7.25 w-full cursor-pointer rounded-lg bg-[#CAEB66] text-[10px] font-medium text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {/* Login */}
          <p className="pt-px text-[10px] text-[#71717A]">
            Already have an account?{" "}
            <Link to={"/login"}>
              <button
                type="button"
                className="cursor-pointer text-black hover:underline"
              >
                Login
              </button>
            </Link>
          </p>

          {/* Or */}
          <div className="flex items-center justify-center py-0.5">
            <span className="text-[10px] text-[#71717A]">Or</span>
          </div>

          {/* Google Register */}
          <GoogleRegister />
        </form>
      </div>
    </div>
  );
}
