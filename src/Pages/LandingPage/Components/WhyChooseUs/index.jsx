const features = [
  {
    image: "/assets/live-tracking.png",
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
  },
  {
    image: "/assets/tiny-deliveryman.png",
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    image: "/assets/safe-delivery.png",
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
  },
];

function WhyChooseUs() {
  return (
    <section>
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-0">
        {/* Top dashed border */}
        <div className="mb-12 border-t border-dashed border-[#03464D]" />

        {/* Features */}
        <div className="space-y-4">
          {features?.map((feature) => (
            <div
              key={feature.title}
              className="flex min-h-[157px] w-full items-center rounded-[14px] bg-white px-5 py-6 sm:px-6 lg:px-[20px]"
            >
              {/* Image */}
              <div className="flex h-full w-[145px] shrink-0 items-center justify-center sm:w-[160px]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="max-h-[130px] max-w-[145px] object-contain"
                />
              </div>

              {/* Vertical dashed divider */}
              <div className="mx-5 h-[82px] shrink-0 border-l border-dashed border-[#79a2a6] sm:mx-7 lg:mx-8" />

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-3 text-[15px] font-bold leading-[20px] tracking-[-0.2px] text-[#03373D] sm:text-[16px]">
                  {feature.title}
                </h3>

                <p className="max-w-[700px] text-[10px] font-normal leading-[17px] text-[#666666] sm:text-[11px] sm:leading-[18px]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom dashed border */}
        <div className="mt-12 border-t border-dashed border-[#79a2a6]" />
      </div>
    </section>
  );
}

export default WhyChooseUs;
