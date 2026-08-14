import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";

const ACTIVE = "#067A87";
const HEADING = "#03373D";
const BUTTON = "#CAEB66";

const FAQS = [
  {
    id: 1,
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
  },
  {
    id: 2,
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, it's designed to be adjustable and comfortable for a wide range of body types and ages, with straps that fit most frames.",
  },
  {
    id: 3,
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "With consistent daily use, it retrains your muscles to hold a proper posture, which can reduce strain-related back pain over time.",
  },
  {
    id: 4,
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Select models include a smart sensor that gently vibrates when it detects slouching, reminding you to straighten up.",
  },
  {
    id: 5,
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You can join the restock waitlist and we'll send you an email the moment it's available again.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      className="rounded-xl border transition-colors duration-200"
      style={{
        borderColor: isOpen ? ACTIVE : "#e5e7eb",
        backgroundColor: isOpen ? "#EAF6F7" : "#ffffff",
      }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span
          className="text-sm font-semibold"
          style={{ color: isOpen ? ACTIVE : HEADING }}
        >
          {item.question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0" style={{ color: ACTIVE }} />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>

      <div
        className={[
          "grid overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0">
          <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openId, setOpenId] = useState(FAQS[0].id);

  return (
    <section className="bg-[#ececec]">
      <div className="text-center">
        <h2
          className="text-3xl font-bold md:text-4xl"
          style={{ color: HEADING }}
        >
          Frequently Asked Question (FAQ)
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 md:text-base">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl space-y-3">
        {FAQS?.map((item) => (
          <FaqItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          className="flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-semibold transition hover:brightness-95"
          style={{ backgroundColor: BUTTON, color: HEADING }}
        >
          See More FAQ's
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: HEADING }}
          >
            <ArrowUpRight className="h-4 w-4 text-white" />
          </span>
        </button>
      </div>
    </section>
  );
}
