import React from 'react'
import Landingpage from '../components/Landingpage'
import SearchBar from '../components/SearchBar'
const page = () => {
  return (
    <>
    <div className="w-full flex justify-center mt-8">
        <SearchBar placeholder="search by company or destination"/>        
      </div>
      <div className="w-full flex justify-center mt-8">
          {/* Subtext */}
      <p className="text-lg font-semibold text-gray-700">Companies partnering with us</p> 
      </div>
    <Landingpage/>
    </>
  )
}

export default page
