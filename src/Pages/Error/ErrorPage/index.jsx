import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="md:max-w-6xl mx-auto px-3 py-8 sm:px-5 sm:py-10 lg:px-0 lg:py-5">
      <div className="flex flex-col min-h-[calc(100vh-50px)] bg-white items-center justify-center rounded-lg px-4">
        {/* Lottie Animation */}
        <div className="h-[170px] w-[170px]">
          <DotLottieReact src="/assets/error.lottie" loop autoplay />
        </div>

        {/* Error Text */}
        <h1 className="text-2xl font-extrabold tracking-tight text-[#18181B] sm:text-3xl">
          Error 404
        </h1>

        {/* Go Home */}
        <Button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 h-8 cursor-pointer rounded-[4px] bg-[#CAEB66] px-3 text-[9px] font-medium text-black hover:bg-[#CAEB66] hover:brightness-95"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
