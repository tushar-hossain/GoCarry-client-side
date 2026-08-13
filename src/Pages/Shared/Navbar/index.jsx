import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Coverage", href: "#coverage" },
  { label: "About Us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Be a Rider", href: "#rider" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full  px-4 py-3 sm:px-6 lg:px-[26px]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-[14px] bg-white px-5 sm:px-7 lg:px-6">
        {/* Logo */}
        <a
          href="/"
          className="flex shrink-0 items-center"
          aria-label="GoCarry Home"
        >
          <img className="w-40" src="/public/assets/logo.png" alt="logo" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-[30px] lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[12px] font-medium text-[#5d5d5d] transition-colors hover:text-[#171717]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/login"
            className="flex h-[34px] items-center justify-center rounded-[10px] border border-[#dedede] px-[26px] text-[14px] font-semibold text-[#5a5a5a] transition hover:bg-[#f7f7f7]"
          >
            Sign In
          </a>

          <div className="flex align-middle">
            <a
              href="#rider"
              className="flex h-[34px] items-center justify-center rounded-[10px] bg-[#c4f044] px-[27px] text-[14px] font-semibold text-[#171717] transition hover:bg-[#b8e638]"
            >
              Be a rider
            </a>

            <a
              href="#rider"
              aria-label="Become a rider"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#202020] text-white transition hover:bg-[#333333]"
            >
              <ArrowUpRight
                className="text-[#c4f044]"
                size={22}
                strokeWidth={2.2}
              />
            </a>
          </div>
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
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-[#5d5d5d] hover:bg-[#f5f5f5]"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-4 flex gap-2 border-t border-[#eeeeee] pt-4">
              <a
                href="/login"
                className="flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#dedede] text-sm font-semibold"
              >
                Sign In
              </a>

              <a
                href="#rider"
                className="flex h-11 flex-1 items-center justify-center rounded-[10px] bg-[#c4f044] text-sm font-semibold"
              >
                Be a rider
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
