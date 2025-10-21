import React from 'react'
import PartnersGrid from '@/components/ui/shared/PartnersGrid'

const page = () => {
  return (
    <>    
      <div className="w-full flex justify-center mt-8">
          {/* Subtext */}
      <p className="text-lg font-semibold text-gray-700">Companies partnering with us</p> 
      </div>
  <PartnersGrid/>
    </>
  )
}

export default page
