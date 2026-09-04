import { ShieldX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="md:max-w-6xl mx-auto px-3 py-8 sm:px-5 sm:py-10 lg:px-0 lg:py-5">
      <div className="flex min-h-[calc(100vh-308px)] bg-white items-center justify-center rounded-lg px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF4F4]">
            <ShieldX className="h-10 w-10 text-red-500" />
          </div>

          <p className="text-6xl font-bold tracking-tight text-[#03373D]">
            403
          </p>
          <h1 className="mt-4 text-2xl font-bold text-[#03373D]">
            Access Denied
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#71717A]">
            You don't have permission to access this page. Please make sure you
            have the required role or contact an administrator.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="h-10 cursor-pointer bg-[#CAEB66] px-5 text-sm font-semibold text-black hover:bg-[#CAEB66] hover:brightness-95"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
