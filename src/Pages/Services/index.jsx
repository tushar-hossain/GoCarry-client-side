import {
  Clock3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Quick and reliable parcel delivery with efficient pickup and delivery services.",
  },
  //   {
  //     id: 2,
  //     icon: MapPin,
  //     title: "Real-Time Tracking",
  //     description:
  //       "Track your parcel from pickup to delivery and stay updated at every step.",
  //   },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Safe & Secure",
    description:
      "We prioritize the safety of your parcels throughout the entire delivery journey.",
  },
  //   {
  //     id: 4,
  //     icon: Store,
  //     title: "Merchant Delivery",
  //     description:
  //       "Reliable delivery solutions designed to help businesses manage their shipments.",
  //   },
  {
    id: 5,
    icon: PackageCheck,
    title: "Door-to-Door",
    description:
      "Send parcels directly from your doorstep to the recipient's preferred address.",
  },
  {
    id: 6,
    icon: Clock3,
    title: "On-Time Delivery",
    description:
      "Efficient delivery operations designed to get your parcel where it needs to go.",
  },
];

export default function Services() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#067A87]">
            Our Services
          </p>

          <h2 className="mt-2 text-[28px] font-bold tracking-[-0.8px] text-[#03373D] sm:text-[36px]">
            Everything You Need to Deliver
          </h2>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services?.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group rounded-2xl border border-[#E5E7EB] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#CAEB66] hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1FAD5] transition group-hover:bg-[#CAEB66]">
                  <Icon className="h-5 w-5 text-[#03373D]" />
                </div>

                <h3 className="mt-4 text-[14px] font-bold text-[#03373D]">
                  {service.title}
                </h3>

                <p className="mt-2 text-[10px] leading-5 text-[#71717A]">
                  {service.description}
                </p>

                <div className="mt-5 h-0.5 w-8 rounded-full bg-[#CAEB66] transition-all duration-300 group-hover:w-14" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
