import useAuth from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

const navItems = [
  { label: "Services", href: "services" },
  { label: "Coverage", href: "coverage" },
  { label: "About Us", href: "about" },
  { label: "Send Parcel", href: "sendParcel" },
  { label: "Pricing", href: "pricing" },
  { label: "Be a Rider", href: "rider" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOutUser } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="md:max-w-6xl mx-auto">
      <nav className="flex items-center justify-between lg:rounded-sm bg-white h-[60px] px-5 sm:px-7 lg:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="GoCarry Home"
        >
          <img className="w-30" src="/assets/favicon.svg" alt="logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-[30px] lg:flex">
          {navItems?.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-[12px] font-medium text-[#5d5d5d] transition-colors hover:text-[#171717]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div className="relative">
              {/* Profile Avatar */}
              <button
                type="button"
                onClick={() => setOpenProfile((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#dedede] bg-[#f3f4f6] focus:outline-none cursor-pointer"
              >
                <img
                  src={user?.photoURL || "/assets/user.png"}
                  alt={user?.displayName || "User"}
                  className="h-full w-full object-cover"
                />
              </button>

              {/* Dropdown */}
              {openProfile && (
                <div className="absolute right-0 top-[55px] z-50 w-[210px] rounded-xl border border-[#e5e5e5] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  {/* Profile */}
                  <Link
                    to="/dashboard"
                    onClick={() => setOpenProfile(false)}
                    className="flex h-10 items-center justify-between rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                  >
                    <span>Dashboard</span>
                  </Link>

                  {/* Settings */}
                  <Link
                    to="/settings"
                    onClick={() => setOpenProfile(false)}
                    className="flex h-10 items-center rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                  >
                    Settings
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenProfile(false);
                      signOutUser()
                        .then(() => {
                          Swal.fire({
                            icon: "success",
                            title: "Logout successful",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          Swal.fire({
                            icon: "success",
                            title: "Logout failed",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        });

                      navigate("/login");
                    }}
                    className="flex h-10 w-full items-center rounded-lg px-3 text-left text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5] cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className=" w-[80px] h-[40px] cursor-pointer rounded-sm border border-[#dedede] text-sm font-semibold">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#202020] text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute left-4 right-4 top-[96px] z-50 rounded-[14px] bg-white p-5 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems?.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-[12px] font-medium text-[#5d5d5d] transition-colors hover:text-[#171717]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex gap-2 border-t border-[#eeeeee] pt-4">
              {user ? (
                <div className="relative">
                  {/* Profile Avatar */}
                  <button
                    type="button"
                    onClick={() => setOpenProfile((prev) => !prev)}
                    className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#dedede] bg-[#f3f4f6] focus:outline-none cursor-pointer"
                  >
                    <img
                      src={user?.photoURL || "/assets/user.png"}
                      alt={user?.displayName || "User"}
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {/* Dropdown */}
                  {openProfile && (
                    <div className="absolute right-0 top-[55px] z-50 w-[210px] rounded-xl border border-[#e5e5e5] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                      {/* Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setOpenProfile(false)}
                        className="flex h-10 items-center justify-between rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                      >
                        <span>Profile</span>
                      </Link>

                      {/* Settings */}
                      <Link
                        to="/settings"
                        onClick={() => setOpenProfile(false)}
                        className="flex h-10 items-center rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                      >
                        Settings
                      </Link>

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={() => {
                          setOpenProfile(false);
                          signOutUser()
                            .then(() => {
                              Swal.fire({
                                icon: "success",
                                title: "Logout successful",
                                showConfirmButton: false,
                                timer: 1500,
                              });
                            })
                            .catch((error) => {
                              console.log(error);
                              Swal.fire({
                                icon: "success",
                                title: "Logout failed",
                                showConfirmButton: false,
                                timer: 1500,
                              });
                            });

                          navigate("/login");
                        }}
                        className="flex h-10 w-full items-center rounded-lg px-3 text-left text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5] cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#dedede] text-sm font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
