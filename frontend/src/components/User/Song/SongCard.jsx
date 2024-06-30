import React, { useEffect, useState } from 'react'
import { FaPlay } from "react-icons/fa";
import "./Song.css"
import { playSong } from '../../../store/musicSlice';
import {addArtist} from "../../../store/artistSlice"
import {useDispatch,useSelector} from 'react-redux'
import axios from "axios"
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"
function SongCard({index,song}) {
  const {_id,songCover,songName,artist,songFile,isFav} =song;
  console.log(isFav);
  console.log(song);
  const navigate =useNavigate()
  const {creatorName} = artist; 

  const dispatch= useDispatch();
  const currSong = useSelector((state)=> state.music.currSong)
  console.log(index);
  const songList = useSelector((state)=> state.music.songList)
  const handlePLay =()=> {
    const music = {
      songId:_id,
      songName,
      artist:creatorName,
      index,
      isFav,
      songFile,
      songCover,
      songPlayed:true,
      
    }
    
      dispatch(playSong(music))

}
 
 

  return (
    <div className='p-4 relative group hover:bg-white/40 peer hover:backdrop-blur-md rounded-md flex flex-col gap-4 '>
        <div className='h-52 overflow-hidden w-52 rounded-md '>
            <img src={songCover} alt="" height={4} width={40} className='w-full h-full'/>
        </div>
        
        <div className=''>
            <p className='font-bold text-white text-base'>{songName}</p>
            <p className='text-white text-xs pointer hover:underline' onClick = {(e)=> {navigate(`/artist/${creatorName}`)}}> {creatorName} </p>
        </div>
        <button className='p-4 absolute right-5 bottom-10 bg-green-500 hidden group-hover:block rounded-full hover:scale-110' onClick={handlePLay}> <FaPlay/> </button>  
    </div>
  )
}

export default SongCard