import React from 'react'
import { RiAppsFill } from "react-icons/ri";
import { GrAppsRounded } from "react-icons/gr";
import { GoClock } from "react-icons/go";
import { IoIosStats } from "react-icons/io";

const Dashborad = () => {
  return (
    <div className = "bg-neutral-800 h-full text-white w-full p-4 rounded-md ">
      <div className='flex flex-col'>

      <div className = "flex items-center gap-2">
        <GrAppsRounded/>
        <p>Home</p>
      </div>
      <div className = "flex items-center gap-2">
        <GoClock/>
        <p>Listen Later</p>
      </div>
      <div className = "flex items-center gap-2">
      <IoIosStats  />

        <p>Statistics</p>
      </div>
      </div>
      <div className='mt-8'>
        <p>YOUR MUSIC</p>

      </div>
        Dashboard
    </div>
  )
}

export default Dashborad