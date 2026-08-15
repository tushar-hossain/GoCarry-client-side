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
        <div className="mb-8 border-t border-dashed border-[#03464D] sm:mb-10 lg:mb-12" />

        {/* Features */}
        <div className="space-y-4">
          {features?.map((feature) => (
            <div
              key={feature.title}
              className="flex min-h-[157px] w-full flex-col items-center rounded-[14px] bg-white px-5 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-[20px]"
            >
              {/* Image */}
              <div className="flex h-[100px] w-full shrink-0 items-center justify-center sm:h-full sm:w-[120px] md:w-[135px] lg:w-[145px]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="max-h-[85px] max-w-[110px] object-contain sm:max-h-[105px] sm:max-w-[125px] lg:max-h-[130px] lg:max-w-[145px]"
                />
              </div>

              {/* Vertical dashed divider */}
              <div className="my-3 h-0 w-full border-t border-dashed border-[#79a2a6] sm:mx-5 sm:my-0 sm:h-[70px] sm:w-0 sm:border-l sm:border-t-0 md:mx-6 lg:mx-8 lg:h-[82px]" />

              {/* Content */}
              <div className="w-full flex-1 text-center sm:text-left">
                <h3 className="mb-2 text-[15px] font-bold leading-[20px] tracking-[-0.2px] text-[#03373D] sm:mb-3 sm:text-[16px]">
                  {feature.title}
                </h3>

                <p className="mx-auto max-w-[700px] text-[10px] font-normal leading-[17px] text-[#666666] sm:mx-0 sm:text-[11px] sm:leading-[18px]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom dashed border */}
        <div className="mt-8 border-t border-dashed border-[#79a2a6] sm:mt-10 lg:mt-12" />
      </div>
    </section>
  );
}

export default WhyChooseUs;
