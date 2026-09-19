import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What is GoCarry?",
    answer:
      "GoCarry is a parcel delivery platform that makes sending and tracking parcels simple, reliable, and convenient.",
  },
  {
    id: 2,
    question: "How do I send a parcel with GoCarry?",
    answer:
      "Simply create an account, go to the Send A Parcel section, enter the sender and receiver information, select the parcel type and destination, and confirm your booking.",
  },
  {
    id: 3,
    question: "How is the delivery cost calculated?",
    answer:
      "The delivery cost depends on the parcel type, destination, and weight. Documents have a fixed charge, while non-document parcels may have an additional charge based on weight.",
  },
  {
    id: 4,
    question: "Can I track my parcel?",
    answer:
      "Yes. Every confirmed parcel receives a unique tracking ID that you can use to monitor your parcel's delivery progress.",
  },
  {
    id: 5,
    question: "What payment methods are supported?",
    answer:
      "GoCarry supports secure online payments through Stripe. You can complete your payment using a supported debit or credit card.",
  },
  {
    id: 6,
    question: "Can I update my parcel information after booking?",
    answer:
      "Yes, you can edit eligible parcel information from the My Parcels section before the parcel reaches a stage where changes are no longer allowed.",
  },
  {
    id: 7,
    question: "What happens if I need help with my delivery?",
    answer:
      "You can contact the GoCarry support team through the Contact section. Our team can help with delivery, payment, tracking, and other parcel-related questions.",
  },
];

export default function FAQS() {
  const [openId, setOpenId] = useState(1);

  const handleToggle = (id) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[2px] text-[#067A87]">
            FAQ
          </p>

          <h2 className="text-[28px] font-bold tracking-[-0.8px] text-[#03373D] sm:text-[36px]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto mt-9 max-w-3xl space-y-2.5">
          {faqs?.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                  isOpen ? "border-[#067A87]/30 shadow-sm" : "border-[#E5E7EB]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(faq.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left sm:px-5"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-bold transition ${
                        isOpen
                          ? "bg-[#067A87] text-white"
                          : "bg-[#F1FAD5] text-[#03373D]"
                      }`}
                    >
                      {String(faq.id).padStart(2, "0")}
                    </span>

                    <span
                      className={`text-[11px] font-semibold transition sm:text-xs ${
                        isOpen ? "text-[#03373D]" : "text-[#18181B]"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen
                        ? "bg-[#CAEB66] text-[#03373D]"
                        : "bg-[#F4F4F5] text-[#71717A]"
                    }`}
                  >
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-[#E5E7EB] px-4 pb-4 pt-3.5 pl-13 sm:px-5 sm:pl-14">
                      <p className="text-[10px] leading-5 text-[#71717A] sm:text-[11px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
