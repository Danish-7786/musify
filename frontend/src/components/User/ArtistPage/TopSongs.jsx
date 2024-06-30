import React,{useState} from 'react'
import { IoPause ,IoPlaySharp} from "react-icons/io5";
import { playSong } from '../../../store/musicSlice';
import { useDispatch } from 'react-redux';
const TopSongs = ({song,artist,index,duration}) => {
console.log(song);
const {songFile,songCover,songName,streams,isFav} = song;

  const [isPlaying,setIsPlaying] =useState(false) 

  const dispatch = useDispatch();
  const handlePlay =()=> {
    const music = {
      songName,
      artist,
      index,
      isFav,
      songFile,
      songCover,
      songPlayed:true,
      
    }
    console.log(music);
      dispatch(playSong(music))

}
 
  return (
    <div className='group'>
        <div className=' grid grid-flow-col grid-cols-3 justify-between gap-10 items-center px-6 hover:bg-white/10 rounded-md py-1'>
          <div className='items-center flex gap-4 col-span-2'>
          <span className=" group-hover:block hidden w-2  rounded-full cursor-pointer" onClick={handlePlay}>
       { isPlaying?<IoPause size={14}/>: <IoPlaySharp size={14}/>}
           </span>
            <h1 className='group-hover:hidden w-2'>{index}</h1>
            <img src={songCover} className=' object-cover rounded-md ' width={50} height={50} alt="" />
            <h1 className='font-semibold'>{songName}</h1>   
          </div>
          <div><span className='text-sm'>
            {streams}</span></div>
          <div>
            <span className='font-semibold text-sm' >{duration||"3:00"}</span>
          </div>
        </div>
    </div>
  )
}

export default TopSongs