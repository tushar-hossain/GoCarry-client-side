import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const ICON_SRC = "/assets/customer-top.png";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Rasel Ahamed",
    role: "CTO",
  },
  {
    id: 2,
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Awlad Hossin",
    role: "Senior Product Designer",
  },
  {
    id: 3,
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Nasir Uddin",
    role: "CEO",
  },
  {
    id: 4,
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Awlad Hossin",
    role: "Senior Product Designer",
  },
  {
    id: 5,
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Rasel Ahamed",
    role: "CTO",
  },
];

function TestimonialCard({ quote, name, role, active }) {
  return (
    <div
      className={[
        "flex h-full flex-col rounded-2xl p-7 transition-all duration-300",
        active
          ? "bg-white shadow-xl shadow-slate-200/70 scale-100"
          : "bg-[#e6e6e6] scale-[0.94] opacity-90",
      ].join(" ")}
    >
      <Quote
        className={active ? "h-7 w-7 text-[#0b4a57]" : "h-7 w-7 text-slate-400"}
        fill="currentColor"
        strokeWidth={0}
      />

      <p
        className={[
          "mt-4 text-[15px] leading-relaxed",
          active ? "text-slate-700" : "text-slate-500",
        ].join(" ")}
      >
        {quote}
      </p>

      <div
        className={[
          "my-5 border-t border-dashed",
          active ? "border-slate-300" : "border-slate-400/60",
        ].join(" ")}
      />

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-300" />
        <div>
          <p
            className={[
              "text-sm font-semibold",
              active ? "text-[#0b4a57]" : "text-slate-500",
            ].join(" ")}
          >
            {name}
          </p>
          <p
            className={[
              "text-xs",
              active ? "text-slate-500" : "text-slate-400",
            ].join(" ")}
          >
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CustomerTestimonials() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const LOOP_TESTIMONIALS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="bg-[#ececec] overflow-hidden">
      <div className="mx-auto max-w-3xl text-center">
        <img src={ICON_SRC} alt="" className="mx-auto mb-6 h-16 w-auto" />

        <h2 className="text-3xl font-bold text-[#0b4a57] md:text-4xl">
          What our customers are sayings
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 md:text-base">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl">
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) =>
            setActiveIndex(swiper.realIndex % TESTIMONIALS.length)
          }
          centeredSlides
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={700}
          spaceBetween={20}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.3 },
          }}
          className="!overflow-visible !py-4"
        >
          {LOOP_TESTIMONIALS?.map((t, i) => (
            <SwiperSlide key={`${t.id}-${i}`} className="!h-auto">
              <TestimonialCard
                {...t}
                active={i % TESTIMONIALS?.length === activeIndex}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            aria-label="Previous testimonial"
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-[#c7de2c] bg-white transition hover:border-slate-400 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS?.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className={[
                  "h-2 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "w-6 bg-[#0b4a57]"
                    : "w-2 bg-slate-300 hover:bg-slate-400",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            aria-label="Next testimonial"
            onClick={() => swiperRef.current?.slideNext()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-[#c7de2c] bg-white transition hover:border-slate-400 hover:text-slate-700"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
