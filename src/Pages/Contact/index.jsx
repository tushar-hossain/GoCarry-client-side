import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // TODO: API / EmailJS request Handel
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for contacting GoCarry. We will get back to you soon.",
      confirmButtonColor: "#CAEB66",
      customClass: {
        confirmButton: "text-black font-medium",
      },
    });

    event.target.reset();
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#067A87]">
            Contact Us
          </p>

          <h2 className="mt-2 text-[28px] font-bold tracking-[-0.8px] text-[#03373D] sm:text-[36px]">
            Let's Talk About Your Delivery
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl bg-[#03373D] p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#CAEB66]">
              Get In Touch
            </p>

            <h3 className="mt-2 text-[23px] font-bold leading-7 text-white">
              We're here to help.
            </h3>

            <p className="mt-3 text-[10px] leading-5 text-[#D4E1E2]">
              Whether you need help with a shipment, have a business inquiry, or
              simply want to know more about GoCarry, feel free to contact us.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#CAEB66]">
                  <Phone className="h-3.5 w-3.5 text-[#03373D]" />
                </div>

                <div>
                  <p className="text-[9px] text-[#AFC4C6]">Phone</p>

                  <p className="mt-0.5 text-[11px] font-medium text-white">
                    +880 1XXX-XXXXXX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#CAEB66]">
                  <Mail className="h-3.5 w-3.5 text-[#03373D]" />
                </div>

                <div>
                  <p className="text-[9px] text-[#AFC4C6]">Email</p>

                  <p className="mt-0.5 text-[11px] font-medium text-white">
                    support@gocarry.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#CAEB66]">
                  <MapPin className="h-3.5 w-3.5 text-[#03373D]" />
                </div>

                <div>
                  <p className="text-[9px] text-[#AFC4C6]">Office</p>

                  <p className="mt-0.5 text-[11px] font-medium text-white">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#CAEB66]">
                  <Clock3 className="h-3.5 w-3.5 text-[#03373D]" />
                </div>

                <div>
                  <p className="text-[9px] text-[#AFC4C6]">Working Hours</p>

                  <p className="mt-0.5 text-[11px] font-medium text-white">
                    Sat - Thu, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 sm:p-8">
            <h3 className="text-[18px] font-bold text-[#03373D]">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-[#18181B]">
                    Name
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="h-8 w-full rounded-lg border border-[#D9E0E5] bg-white px-3 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]/30"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-[#18181B]">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    className="h-8 w-full rounded-lg border border-[#D9E0E5] bg-white px-3 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-[#18181B]">
                  Subject
                </label>

                <input
                  type="text"
                  required
                  placeholder="How can we help?"
                  className="h-8 w-full rounded-lg border border-[#D9E0E5] bg-white px-3 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-[#18181B]">
                  Message
                </label>

                <textarea
                  required
                  rows="5"
                  placeholder="Write your message..."
                  className="min-h-27.5 w-full resize-none rounded-lg border border-[#D9E0E5] bg-white px-3 py-2 text-[10px] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#CAEB66] text-[10px] font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
