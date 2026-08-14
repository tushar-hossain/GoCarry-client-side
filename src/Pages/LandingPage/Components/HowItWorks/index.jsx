import bookingIcon from "/assets/bookingIcon.png";

const services = [
  {
    title: "Booking Pick & Drop",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    title: "Cash On Delivery",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    title: "Delivery Hub",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    title: "Booking SME & Corporate",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
];

function HowItWorks() {
  return (
    <section className="w-full bg-[#eef0f1]">
      <div className="mx-auto max-w-[1038px] w-full px-4 sm:px-6 lg:px-0">
        {/* Section Heading */}
        <h2 className="mb-5 text-[18px] font-bold leading-[22px] tracking-[-0.4px] text-[#003f46]">
          How it Works
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="min-h-[156px] rounded-[15px] bg-[#fafafa] px-[19px] py-[18px]"
            >
              {/* Icon */}
              <div className="mb-3 h-[38px] w-[38px]">
                <img
                  src={bookingIcon}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="mb-2 text-[12px] font-bold leading-[16px] text-[#003f46]">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-[9px] font-normal leading-[14px] text-[#666666]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
