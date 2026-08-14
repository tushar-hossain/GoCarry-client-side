import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const brands = [
  "/assets/brands/amazon.png",
  "/assets/brands/amazon_vector.png",
  "/assets/brands/casio.png",
  "/assets/brands/moonstar.png",
  "/assets/brands/randstad.png",
  "/assets/brands/star.png",
  "/assets/brands/start_people.png",
];

function BrandsClient() {
  return (
    <section>
      {/* Heading */}
      <div className="mx-auto mb-10 px-4 text-center">
        <h2 className="text-[24px] font-bold tracking-[-0.5px] text-[#03373D] sm:text-[28px]">
          We've helped thousands of sales teams
        </h2>
      </div>

      {/* Brand Slider */}
      <div>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={30}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={true}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 45,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
        >
          {brands?.map((brand, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-[60px] items-center justify-center">
                <img
                  src={brand}
                  alt={`Client brand ${index + 1}`}
                  className="max-h-[45px] max-w-[140px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default BrandsClient;
