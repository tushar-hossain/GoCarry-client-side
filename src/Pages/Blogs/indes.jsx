import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";

const blogs = [
  {
    id: 1,
    category: "Delivery Tips",
    title: "How to Pack Your Parcel Safely for Delivery",
    description:
      "Learn simple and practical ways to pack your parcels properly and reduce the risk of damage during delivery.",
    date: "Aug 12, 2026",
    readTime: "4 min read",
  },
  {
    id: 2,
    category: "Business",
    title: "How Reliable Delivery Helps Your Business Grow",
    description:
      "Discover how a smooth delivery experience can improve customer satisfaction and make your business more efficient.",
    date: "Aug 08, 2026",
    readTime: "5 min read",
  },
  {
    id: 3,
    category: "GoCarry Guide",
    title: "A Simple Guide to Sending Your First Parcel",
    description:
      "Everything you need to know about creating a parcel, choosing a destination, tracking your shipment, and more.",
    date: "Aug 03, 2026",
    readTime: "3 min read",
  },
];

export default function Blogs() {
  return (
    <section className="bg-[#EEF0F1] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#067A87]">
              Our Blog
            </p>

            <h2 className="mt-2 text-[28px] font-bold tracking-[-0.8px] text-[#03373D] sm:text-[36px]">
              Tips, Guides & Delivery Insights
            </h2>
          </div>

          {/* <button
            type="button"
            className="flex w-fit cursor-pointer items-center gap-1.5 rounded-md bg-[#CAEB66] px-4 py-2 text-[10px] font-medium text-black transition hover:brightness-95"
          >
            View All Blogs
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button> */}
        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {blogs?.map((blog) => (
            <article
              key={blog.id}
              className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#CAEB66] hover:shadow-md"
            >
              <div className="relative flex h-43.75 items-center justify-center overflow-hidden bg-[#F1FAD5]">
                <div className="absolute inset-0 bg-linear-to-br from-[#CAEB66]/40 via-transparent to-[#03373D]/10" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <span className="text-2xl font-bold text-[#03373D]">GC</span>
                </div>

                <span className="absolute left-4 top-4 rounded-full bg-white px-2.5 py-1 text-[8px] font-medium text-[#03373D]">
                  {blog.category}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 text-[9px] text-[#71717A]">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {blog.date}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3 w-3" />
                    {blog.readTime}
                  </span>
                </div>

                <h3 className="mt-3 text-[15px] font-bold leading-5 text-[#03373D] transition group-hover:text-[#067A87]">
                  {blog.title}
                </h3>

                <p className="mt-2 text-[10px] leading-5 text-[#71717A]">
                  {blog.description}
                </p>

                {/* <button
                  type="button"
                  className="mt-4 flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-[#03373D] hover:text-[#067A87]"
                >
                  Read More
                  <ArrowUpRight className="h-3 w-3" />
                </button> */}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
