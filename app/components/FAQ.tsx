"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do i send a parcel?",
    answer:
      "Choose the conpany you sending with, fill your infiormation then make a drop off to the  office of the company involved.",
  },
  {
    question: "How do I track my parcel?",
    answer:
      "Enter your tracking number in the search bar and click Track. You’ll instantly see real-time updates.",
  },
  {
    question: "How do i make a drop off?",
    answer:
      "visit the office of the company you are sending with and hand over your parcel to the customer service representative.",
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
