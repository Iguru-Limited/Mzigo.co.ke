// components/Importance.tsx
import Image from "next/image";

const valueProps = [
  {
    id: 1,
    title: "Zero Office Visits",
    description:
      "Customers can send, receive, and track packages without stepping into a logistics office — everything is done online.",
    tag: "Convenience",
    image: "/images/delivery.png",
  },
  {
    id: 2,
    title: "Real-Time Parcel Tracking",
    description:
      "Stay updated every step of the way with real-time delivery tracking and automated status updates.",
    tag: "Transparency",
    image: "/images/rtmtracking.png",
  },
  {
    id: 3,
    title: "Built for All Sizes",
    description:
      "Whether you're an individual, SME, or enterprise, our tools scale with your needs — from lockers to API integrations.",
    tag: "Scalability",
    image: "/images/allsizes.png",
  },
];

export default function Importance() {
  return (
    <section className="bg-white py-20 px-6 text-center">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#000000]">
          Why Choose Us?
        </h2>
        <p className="text-black text-lg max-w-2xl mx-auto mb-16">
          At Mzigo, we're transforming delivery by making it faster, more
          flexible, and fully digital — for individuals and businesses alike.
        </p>

        {/* Value Props Grid - Modified layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* First two cards in a row */}
          {valueProps.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden group bg-white flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 bg-white text-sm px-3 py-1 rounded-full font-semibold shadow">
                  {item.tag}
                </span>
              </div>

              {/* Text Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-bold text-[#000000] mb-2">
                  {item.title}
                </h3>
                <p className="text-black text-sm">{item.description}</p>
              </div>
            </div>
          ))}

          {/* Third card spanning full width below */}
          <div className="md:col-span-2">
            <div className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden group bg-white flex flex-col md:flex-row">
              {/* Image - Full width on mobile, half width on desktop */}
              <div className="relative h-52 md:h-auto md:w-1/2 overflow-hidden">
                <Image
                  src={valueProps[2].image}
                  alt={valueProps[2].title}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 bg-white text-sm px-3 py-1 rounded-full font-semibold shadow">
                  {valueProps[2].tag}
                </span>
              </div>

              {/* Text Content - Full width on mobile, half width on desktop */}
              <div className="p-6 flex-1 flex flex-col justify-center md:w-1/2">
                <h3 className="text-lg md:text-xl font-bold text-[#050505] mb-2">
                  {valueProps[2].title}
                </h3>
                <p className="text-black text-sm md:text-base">
                  {valueProps[2].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
