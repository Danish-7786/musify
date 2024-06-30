import React, { useState } from 'react'
import {useParams} from "react-router-dom"
import { IoPause ,IoPlaySharp} from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { IoPencil } from "react-icons/io5";
import EditPlaylist from './EditPlaylist';

export const PlaylistPage = ({playlistCover,playlistName,username,songs}) => {
  const [isPlaying,setIsPlaying] =useState(false) 
    const {playlistId} = useParams()
    const [editable ,setEditable] = useState(false)
  return (
    <div className=''>
        <div>
          <div className='flex gap-4 p-4 relative'>
            <div className='relative group'>

            <button className='group-hover:block hidden absolute p-8 bg-black/20 drop-shadow-lg' 
            onClick={(e)=> setEditable(true)}
            >

          <IoPencil className="text-green-500 "  size={44}/>
            </button>

            <img src="../playlist.png" alt="" className='h-28 rounded-md shadow-lg' />
            </div>

            <div className='mt-4 text-white flex flex-col gap-2'>
            <p className='text-xs font-semibold'>Playlist</p>
            <h1 className='font-bold text-4xl'>{playlistName||"My Playlist"}</h1>
            <div className='flex gap-2'>
            <p className='text-xs font-semibold'> {username||"Danish Pathan"}</p>

            <p className='text-xs'>{"songs"||"0 songs"}</p>
            </div>
          </div>
            </div>
        </div>
        <div>
        
          <div className=''>

           {editable && (<EditPlaylist editable={editable} setEditable={setEditable} />)}
          </div>
    
            <div className='bg-gradient-to-b from-orange-800/50 to-orange-500/0 p-4'>
                <button>
                <span className="icon bg-green-500  rounded-full p-4 ">

                 { isPlaying?<IoPause size={24}/>: <IoPlaySharp size={24}/>}
                 </span>
                </button>
            </div>
        </div>


        <div className='px-4'>
         <h2 className='font-bold text-xl text-white'>Lets find something for your playlist </h2>
         <div className=' flex bg-white/60 rounded-md py-1 items-center gap-2 px-4 w-[60%]'>
          <IoSearch size={20}/>
         <input type="text" className='bg-transparent outline-none text-lg text-black' placeholder='Search for songs' />
         </div>
                 </div>
    </div>
  )
}
