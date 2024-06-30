import React from 'react'


import Dashborad from '../Dashboard/Dashborad'
import { FiSearch } from "react-icons/fi";
import StatCard from './StatCard';
import Graph from './Graphs';
import AddSong from "./AddSong"
const HomePage = () => {
  return (
    <div className='bg-neutral-900 flex gap-4 h-screen overflow-x-hidden'>
      <div className='w-[15rem] rounded-md'>
        <Dashborad/>
        </div>
      <div className = "flex flex-col">

        {/*  
        <div className='bg-neutral-600 px-4 flex rounded-md py-[1px] items-center '>
        <FiSearch className='font-bold text-neutral-400'/>
        <input type="text" placeholder='' className='rounded-md outline-none bg-neutral-600/85 ' name="" id="" />
        </div> 
        */}
      <h1 className='text-white text-3xl p-4'>Your Statistics</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>

      <StatCard title={"Follower"} data={"5M+"}/>
      <StatCard title={"My Songs"} data={"50+"}/>
      <StatCard title={"Hours Stream"} data={"100+"}/>


      </div>
      <div className='mt-4 hidden md:visible'>

       <Graph/>
      </div>
      <div>
        
       <AddSong/>
      </div>
      </div>
      </div>
  )
}

export default HomePage