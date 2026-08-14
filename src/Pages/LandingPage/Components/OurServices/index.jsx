import {
  Truck,
  Globe,
  PackageCheck,
  Banknote,
  Building2,
  RotateCcw,
} from "lucide-react";

const services = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: Truck,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: Globe,
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: PackageCheck,
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    icon: Banknote,
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    icon: Building2,
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    icon: RotateCcw,
  },
];

function OurServices() {
  return (
    <section className="w-full bg-[#eef0f1]">
      <div className="mx-auto rounded-[32px] bg-[#03373D] px-6 py-14 sm:px-10 lg:px-16">
        {/* Heading */}
        <div className="mx-auto mb-12 text-center">
          <h2 className="mb-4 text-[36px] font-bold leading-none tracking-[-0.03em] text-white">
            Our Services
          </h2>

          <p className="text-[14px] leading-7 text-[#D7E6E7]">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        {/* Services */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className={`group rounded-[24px] px-8 py-9 text-center transition-all duration-300 hover:-translate-y-1 bg-white hover:bg-[#CAEB66]`}
              >
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF1F5] transition-all duration-300 group-hover:bg-white/60">
                  <Icon
                    size={32}
                    strokeWidth={1.7}
                    className="text-[#03373D] transition-colors duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="mx-auto mb-4 text-[20px] font-bold leading-7 tracking-[-0.02em] text-[#05373D]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] leading-6 text-[#526467]">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OurServices;
