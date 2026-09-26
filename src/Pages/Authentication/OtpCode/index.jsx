import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export default function OtpCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const email = location.state?.email;
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const otp = watch("otp");

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) {
      const updated = [...otp];
      updated[index] = "";
      setValue("otp", updated);
      return;
    }

    const updated = [...otp];
    updated[index] = val[val.length - 1];
    setValue("otp", updated);
    clearErrors("otp");

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const updated = [...otp];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || "";
    }
    setValue("otp", updated);
    clearErrors("otp");

    const nextIndex = Math.min(pasted.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0 || isLoading || !email) return;

    setIsLoading(true);

    try {
      const response = await axiosPublic.post("/auth/forgot-password", {
        email,
      });

      if (response.data.success) {
        setTimeLeft(60);

        // Clear previous OTP
        setValue("otp", ["", "", "", "", "", ""]);
        clearErrors("otp");

        inputsRef.current[0]?.focus();

        await Swal.fire({
          icon: "success",
          title: "OTP sent again",
          text: "A new verification code has been sent to your email.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed to resend OTP",
        text: error?.response?.data?.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (isLoading) return;

    const code = data.otp.join("");

    if (code?.length < 6) {
      setError("otp", {
        message: "Enter the full 6 digit code",
      });
      return;
    }

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Session expired",
        text: "Please request a new OTP.",
      });

      navigate("/forgot-password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosPublic.post("/auth/verify-otp", {
        email,
        otp: code,
      });

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Code verified",
          showConfirmButton: false,
          timer: 1000,
        });

        navigate("/reset-password", {
          state: {
            email,
            resetToken: response.data.resetToken,
          },
        });
      }
    } catch (error) {
      console.error(error);

      setError("otp", {
        message: error?.response?.data?.message || "Invalid or expired OTP.",
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
            Enter Code
          </h1>

          <p className="mt-1 text-[9px] text-black">
            Enter 6 digit code that we sent in your email address
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* OTP Inputs */}
          <div>
            <div className="flex justify-between gap-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={isLoading}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`h-7.25 w-full rounded-lg border bg-white text-center text-[10px] outline-none focus:border-[#CAEB66] disabled:cursor-not-allowed disabled:bg-gray-100 ${
                    errors.otp ? "border-red-400" : "border-[#D9E0E5]"
                  }`}
                />
              ))}
            </div>

            {errors?.otp && (
              <p className="mt-1 text-[10px] text-red-500">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* Timer / Resend */}
          <div className="flex items-center justify-between text-[10px]">
            <p className="text-[#71717A]">
              {timeLeft > 0
                ? `Resend OTP in ${formatTime(timeLeft)}`
                : "Didn't receive the code?"}
            </p>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timeLeft > 0 || isLoading}
              className="cursor-pointer font-medium text-black hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
            >
              Resend OTP
            </button>
          </div>

          {/* Verify */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-7.25 w-full items-center justify-center gap-1 rounded-lg bg-[#CAEB66] text-[10px] font-medium text-black cursor-pointer transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
