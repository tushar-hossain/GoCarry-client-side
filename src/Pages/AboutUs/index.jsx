import { useState } from "react";

const tabs = [
  {
    id: "story",
    label: "Story",
    content: [
      "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",

      "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",

      "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
    ],
  },

  {
    id: "mission",
    label: "Mission",
    content: [
      "Our mission is to make parcel delivery simple, reliable, and accessible for everyone. We focus on providing a smooth delivery experience through efficient logistics, real-time tracking, and dependable customer support.",

      "We continuously improve our services so customers and businesses can send and receive parcels with confidence, knowing that every shipment is handled with care.",
    ],
  },

  {
    id: "success",
    label: "Success",
    content: [
      "Our success comes from the trust of thousands of customers and businesses who rely on us for their everyday delivery needs.",

      "Through reliable service, efficient logistics, and continuous improvement, we continue to build a delivery network that makes parcel delivery faster and easier.",
    ],
  },

  {
    id: "team",
    label: "Team & Others",
    content: [
      "Our team is built around people who believe in reliable service, teamwork, and putting customers first. Every member contributes to creating a better delivery experience.",

      "From logistics and operations to customer support, our teams work together to make every parcel journey simple and dependable.",
    ],
  },
];

function AboutUs() {
  const [activeTab, setActiveTab] = useState("story");
  const activeContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="w-full bg-[#eef0f1] px-3 py-8 sm:px-5 sm:py-10 lg:px-0 lg:py-5">
      <div className="mx-auto w-full rounded-[14px] bg-white px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14 lg:px-[52px] lg:py-[38px]">
        <div>
          <h1 className="text-[25px] font-bold leading-[32px] tracking-[-0.7px] text-[#03373D] sm:text-[30px] sm:leading-[38px] lg:text-[28px]">
            About Us
          </h1>

          <p className="mt-4 text-[12px] font-normal leading-[20px] text-[#71717A] sm:text-[13px]">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        <div className="mt-9 border-t border-[#E5E7EB] sm:mt-10" />

        <div className="mt-8 flex flex-wrap items-center gap-x-9 gap-y-4 sm:mt-9 sm:gap-x-10">
          {tabs?.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "cursor-pointer text-[16px] font-normal leading-[24px] transition-all duration-200",
                  isActive
                    ? "font-semibold text-[#607A3A]"
                    : "text-[#858585] hover:text-[#607A3A]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 sm:mt-5">
          {activeContent?.content?.map((paragraph, index) => (
            <p
              key={index}
              className="mb-5 text-[13px] font-normal leading-[24px] text-[#666666] last:mb-0 sm:text-[14px] sm:leading-[30px] md:text-[15px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
