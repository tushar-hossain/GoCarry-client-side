import { FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router";

const Footer = () => {
  const navItems = [
    { label: "Services", href: "/services" },
    { label: "Coverage", href: "/coverage" },
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="md:max-w-6xl mx-auto px-6 text-center lg:rounded-[14px] flex min-h-47.5 flex-col items-center justify-center bg-[#0d0d0d] py-8 sm:px-7 lg:px-6">
      {/* Logo */}
      <Link to={"/"} className="mb-3 flex items-center" aria-label="GoCarry">
        <span className="text-[18px] font-bold tracking-[-0.8px] text-white">
          GoCarry
        </span>
      </Link>

      {/* Description */}
      <p className="max-w-117.5 text-center text-[7px] leading-2.75 text-[#DADADA] sm:text-[10px] sm:leading-3">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments. we deliver on
        time, every time.
      </p>

      {/* Divider */}
      <div className="mt-3 w-full max-w-132.5 border-t border-dashed border-[#17454b]" />

      {/* Navigation */}
      <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {navItems?.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="text-[10px] font-medium text-[#bdbdbd] transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="mt-3 w-full max-w-132.5 border-t border-dashed border-[#17454b]" />

      {/* Social Icons */}
      <div className="mt-3 flex items-center gap-2.5">
        {/* LinkedIn */}
        <Link
          to="https://www.linkedin.com/"
          target="_blank"
          aria-label="LinkedIn"
          className="flex h-3.75 w-3.75 items-center justify-center rounded-full bg-[#087ea4] text-white transition-transform hover:scale-110"
        >
          <FaLinkedinIn size={8} />
        </Link>

        {/* X */}
        <Link
          to="https://x.com/"
          target="_blank"
          aria-label="X"
          className="flex h-3.75 w-3.75 items-center justify-center rounded-full bg-white text-[#111] transition-transform hover:scale-110"
        >
          <FaXTwitter size={7} />
        </Link>

        {/* Facebook */}
        <Link
          to="https://www.facebook.com/"
          target="_blank"
          aria-label="Facebook"
          className="flex h-3.75 w-3.75 items-center justify-center rounded-full bg-[#1877f2] text-white transition-transform hover:scale-110"
        >
          <FaFacebookF size={8} />
        </Link>

        {/* YouTube */}
        <Link
          to="https://www.youtube.com/"
          target="_blank"
          aria-label="YouTube"
          className="flex h-3.75 w-3.75 items-center justify-center rounded-full bg-[#ff0000] text-white transition-transform hover:scale-110"
        >
          <FaYoutube size={8} />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
