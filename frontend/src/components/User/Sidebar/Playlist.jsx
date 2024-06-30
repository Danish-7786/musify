import React, { useEffect, useState } from 'react'
import { RiPlayListFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import "./../../Profile.css"
import axios from "axios"
import Cookies from "js-cookie";
import PlaylistCard from '../Playlist/PlaylistCard';
const Playlist = () => {
  const navigate = useNavigate();
  const [click,setClick] = useState(true)
  const [username,setUsername] = useState('')
  const [playlist,setPLaylist] = useState([])
  const handlePlaylist = async()=> {
    const accessToken = Cookies.get("accessToken");
    try {
      let response = await axios.post("http://localhost:3000/api/v1/users/create-playlist",{},{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(response.data.playlist);
      setPLaylist(response.data.playlist)
      
    } 
    catch (error) {
      console.log(error);
    }
  }
  const fetchJson = async (url) => {
    const accessToken = Cookies.get("accessToken");
    const response = await axios.get(url,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  };
  
  useEffect(()=> {

      fetchJson("http://localhost:3000/api/v1/users/get-playlist").then(({data})=> {
        
        setUsername(data.data.fullName)
        setPLaylist(data.data.playlist)})
    
  
  },[])
  return (
    <div className='bg-neutral-900 h-full flex flex-col rounded-md'>
        <div className=' p-4 text-white/80 hover:text-white '>
       
        <div className='flex w-full gap-2 '>

        <RiPlayListFill size={20}/>
     
        <p>Your Library</p>
        <div className='relative items-end'>

       <button className='hover:bg-black hover:text-white rounded-full p-1' onClick= {()=> setClick(!click)}>
        <FaPlus/>
       </button>
        </div>
       
    
          </div>

          <div className={`cursor-pointer absolute w-40 right-0  mt-2  text-white font-medium text-sm rounded-md bg-neutral-800 shadow-md ${click ? 'hid' : 'vis'}`}>
         <div className='p-2 hover:bg-neutral-950' onClick={handlePlaylist}> Create an PLayList </div>

         </div>
       
        </div>
        <div className='scroll overflow-y-auto'>
        {
          
  playlist.map((play,index)=> {
  
    return <div key={index} onClick={(e)=> navigate(`/playlist/${play._id}`)}>
      <PlaylistCard key = {play._id} username={username} playListName={play.playlistName} song = {play.song} />
      </div>
  }
  )
}
        </div>
    </div>
  )
}

export default Playlist