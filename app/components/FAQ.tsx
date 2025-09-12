"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I track my parcel?",
    answer:
      "Enter your tracking number in the search bar and click Track. You’ll instantly see real-time updates.",
  },
  {
    question: "Can I change the delivery address?",
    answer:
      "Yes, you can update your delivery address within 2 hours of booking. Go to your account → Manage Orders → Update Address.",
  },
  {
    question: "What happens if my parcel is delayed?",
    answer:
      "You’ll get a new estimated delivery date on your tracking page. If it’s urgent, our support team is available 24/7.",
  },
  {
    question: "Is my parcel insured?",
    answer:
      "Yes. All parcels come with basic insurance. You can also add extra coverage for valuable items during checkout.",
  },
  {
    question: "How do I schedule a pickup?",
    answer:
      "Log in, select Book Pickup, choose your location and time. A courier will collect your parcel at your doorstep.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2c3e50] mb-8">
        Frequently Asked Questions
      </h2>

      {/* FAQ Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl shadow-sm bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-4 sm:px-6 py-4 text-left text-sm sm:text-base font-medium text-gray-800 hover:bg-gray-50 rounded-2xl transition"
            >
              {faq.question}
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 sm:px-6 pb-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
