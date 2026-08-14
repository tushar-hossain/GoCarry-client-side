function MerchantCTA() {
  return (
    <section className="w-full bg-[#eef0f1]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-0">
        <div
          className="relative min-h-[205px] overflow-hidden rounded-[16px] bg-[#03373D]"
          style={{
            backgroundImage: "url('/assets/be-a-merchant-bg.png')",
            backgroundPosition: "top center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Content */}
          <div className="relative z-10 flex min-h-[205px] w-full items-center px-8 py-8 sm:px-10 lg:px-[38px]">
            <div className="w-full max-w-[430px]">
              {/* Heading */}
              <h2 className="mb-3 max-w-[390px] text-[20px] font-bold leading-[24px] tracking-[-0.4px] text-white sm:text-[21px]">
                Merchant and Customer Satisfaction
                <br />
                is Our First Priority
              </h2>

              {/* Description */}
              <p className="mb-4 max-w-[390px] text-[8px] leading-[13px] text-[#D5E2E3] sm:text-[9px] sm:leading-[14px]">
                We offer the best delivery charge with the highest value along
                with 100% safety of your product. Pathao courier delivers your
                parcels in every corner of Bangladesh right on time.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[#CAEB66] px-5 py-[7px] text-[9px] font-semibold text-[#CAEB66] transition-all duration-300 hover:bg-[#CAEB66] hover:text-[#03373D]"
                >
                  Become a Merchant
                </button>

                <button
                  type="button"
                  className="rounded-full border border-[#CAEB66] px-5 py-[7px] text-[9px] font-semibold text-[#CAEB66] transition-all duration-300 hover:bg-[#CAEB66] hover:text-[#03373D]"
                >
                  Earn with ZapShift Courier
                </button>
              </div>
            </div>

            {/* Merchant Illustration */}
            <div className="pointer-events-none absolute right-[18px] top-1/2 hidden -translate-y-1/2 sm:block lg:right-[25px]">
              <img
                src="/assets/location-merchant.png"
                alt=""
                className="h-[155px] w-auto object-contain lg:h-[165px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MerchantCTA;
