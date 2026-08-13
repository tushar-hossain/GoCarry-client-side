import { FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Coverage", href: "#coverage" },
    { label: "About Us", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 text-center rounded-[14px] flex min-h-[190px] flex-col items-center justify-center bg-[#0d0d0d] py-8 sm:px-7 lg:px-6">
      {/* Logo */}
      <a href="/" className="mb-3 flex items-center" aria-label="GoCarry">
        {/* Logo Icon */}
        {/* <div className="relative mr-1.5 h-[22px] w-[18px]">
            <div
              className="absolute left-0 top-0 h-[20px] w-[14px] bg-[#c4f044]"
              style={{
                clipPath:
                  "polygon(0 18%, 55% 0, 55% 20%, 100% 20%, 100% 80%, 55% 80%, 55% 100%, 0 82%)",
              }}
            />
          </div> */}

        <span className="text-[18px] font-bold tracking-[-0.8px] text-white">
          GoCarry
        </span>
      </a>

      {/* Description */}
      <p className="max-w-[470px] text-center text-[7px] leading-[11px] text-[#DADADA] sm:text-[8px] sm:leading-[12px]">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>

      {/* Divider */}
      <div className="mt-3 w-full max-w-[530px] border-t border-dashed border-[#17454b]" />

      {/* Navigation */}
      <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-[7px] font-medium text-[#bdbdbd] transition-colors hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="mt-3 w-full max-w-[530px] border-t border-dashed border-[#17454b]" />

      {/* Social Icons */}
      <div className="mt-3 flex items-center gap-2.5">
        {/* LinkedIn */}
        <a
          href="#"
          aria-label="LinkedIn"
          className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#087ea4] text-white transition-transform hover:scale-110"
        >
          <FaLinkedinIn size={8} />
        </a>

        {/* X */}
        <a
          href="#"
          aria-label="X"
          className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-white text-[#111] transition-transform hover:scale-110"
        >
          <FaXTwitter size={7} />
        </a>

        {/* Facebook */}
        <a
          href="#"
          aria-label="Facebook"
          className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#1877f2] text-white transition-transform hover:scale-110"
        >
          <FaFacebookF size={8} />
        </a>

        {/* YouTube */}
        <a
          href="#"
          aria-label="YouTube"
          className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#ff0000] text-white transition-transform hover:scale-110"
        >
          <FaYoutube size={8} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
