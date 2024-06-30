import React, { useEffect, useState } from 'react'
import { FaVolumeLow } from 'react-icons/fa6'
import { FaVolumeOff } from "react-icons/fa";

import { FaVolumeXmark } from "react-icons/fa6";
import { FaVolumeHigh } from "react-icons/fa6";
const Volume = ({audioRef}) => {
  const [volume,setVolume] = useState(60);
  const [muteVolume,setMuteVolume] = useState(false)
  useEffect(()=> {
    console.log(audioRef.current.volume);
    if(audioRef) audioRef.current.volume = volume/100;
    console.log(volume);
  }
,[volume,audioRef]);
  return (
    <div>  <div className='flex items-center gap-3'>
  
  <button onClick={() => setMuteVolume((prev) => !prev)}>
  {muteVolume || volume == 0 ? (
    <FaVolumeXmark />
  ) : volume < 40 ? (
    <FaVolumeLow />
  ) : (
    <FaVolumeHigh />
  )}
</button>
    <input type="range" min={0} max ={100} value={volume} onChange = {(e)=> setVolume(e.target.value)}name="" id="" />
</div>
</div>
  )
}

export default Volume