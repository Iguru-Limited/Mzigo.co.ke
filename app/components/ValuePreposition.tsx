"use client";

import Image from "next/image";

export default function ValuePreposition() {
  const services = [
    {
      title: "Individuals",
      subtitle: "Send and receive parcels easily",
      description:
        "Book a delivery online without visiting the office. Track your parcel in real-time from pickup to drop-off.",
      image: "/images/recive1.jpeg",
    },
    {
      title: "Small Businesses",
      subtitle: "Grow your reach",
      description:
        "Offer reliable delivery to your customers with simple integrations and on-demand pickups.",
      image: "/images/small busines.jpeg",
    },
    {
      title: "Large Companies",
      subtitle: "Efficient operations at scale",
      description:
        "Manage bulk parcel deliveries with advanced tools, dashboards, and local rider support.",
      image: "/images/ops.jpg",
    },
  ];

  return (
    <section className="px-6 py-16 bg-white">
      {/* Section header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          We simplify parcel delivery
        </h2>
        <p className="mt-4 text-gray-600">
          Reliable delivery solutions for individuals and businesses. Send and
          track parcels anywhere in the country, all online.
        </p>
      </div>

      {/* Services grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md overflow-hidden bg-gray-50  transition transform  duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="relative h-48 w-full">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <span className="text-sm font-medium text-black uppercase">
                {service.title}
              </span>
              <h3 className="text-lg text-black font-semibold mt-2">
                {service.subtitle}
              </h3>
              <p className="text-black mt-3 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
