import React from 'react'

function Hero() {
  return (
    <section className="text-center px-6 py-16 bg-white">     

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-snug">
        Send Mzigo with ease.<br />
        Track every step until delivery
      </h1>

      {/* Buttons */}
      <div className="flex justify-center space-x-6 mb-10">
        <button className="bg-[#2c3e50] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1a252f] transition">
          Send Mzigo
        </button>
        <button className="bg-[#2c3e50] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d84343] transition">
          Track mzigo
        </button>
      </div>

      {/* Subtext */}
      <p className="text-lg font-semibold text-gray-700">
        Choose your carrier
      </p>
    </section>
  )
}

export default Hero