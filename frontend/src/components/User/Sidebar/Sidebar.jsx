import React from 'react'
import Navbar from './Navbar';
import Playlist from './Playlist';

const Sidebar = () => {
  return (
    <div className= "resize-none md:resize-x bg-black text-white w-full flex flex-col gap-2 h-full">
      <Navbar/>
      <Playlist/>
      
    </div>
  )
}

export default Sidebar;