import { Outlet } from "react-router";

export default function AuthLauout() {
  return (
    <section className="md:max-w-6xl mx-auto lg:pt-8">
      <div className="h-auto md:h-[90vh] w-full mx-auto lg:rounded-3xl bg-white p-5">
        <div className="flex lg:items-center flex-col-reverse md:flex-row h-full w-full mx-auto">
          {/* Login Form */}
          <div className="flex w-full flex-1 items-start justify-center overflow-y-auto bg-white px-6 py-6 md:w-[53%] md:px-8 md:py-0">
            <Outlet />
          </div>

          {/* Image */}
          <div className="flex min-h-0 w-full lg:h-full flex-1 items-center justify-center bg-[#FAFDF0] md:w-[47%]">
            <img
              src="/assets/authImage.png"
              alt="Auth illustration"
              className=" w-[55%] max-w-[320px] object-contain sm:w-[50%] md:w-[65%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
