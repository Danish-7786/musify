import React, { useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import axios from "axios"
import Cookies from "js-cookie"
import SearchSong from './SearchSong';
const Search = () => {
  const [searchInput,setSearchInput] = useState("");
  const [searchedSong,setSearchedSong] = useState([]);
  const handleSearch = async(e)=> {
    setSearchInput(e.target.value)
    try{
      const accessToken = Cookies.get("accessToken");
      console.log(accessToken);
     //  after post you have to pass some data if you dont have any data to pass just pass empty {}
     const res= await axios.get(`http://localhost:3000/api/v1/song/search-song/${searchInput}`,
      { headers: {
          Authorization:`Bearer ${accessToken}`,
         },
       })
       console.log(res.data);
       setSearchedSong(res.data.data.son)
       console.log(searchedSong);
      }

      catch(err){
        console.log(err);
      }
  }
  console.log(searchedSong);
  
  return (
    <div className='w-full text-center'>
      <div className='flex justify-center '>

        <div className='flex bg-neutral-700/80 items-center w-[20rem] rounded-full p-3 gap-2 '>

            <button className='' onClick= {handleSearch}> 
              <IoMdSearch size={24} className="text-neutral-500"/>
              </button>
        <input type="text" value= {searchInput} onChange={(e)=> handleSearch(e)} className='bg-transparent outline-none w-full text-white font-semibold' placeholder='What do you want to listen?'/>
        </div>
      </div>
        
       
        {/* SONGS */}
        <div className='mt-10 flex flex-col gap-4'>
          <h1 className='text-xl font-bold '>Songs</h1>
        {searchedSong.length>0 &&
        
        searchedSong.map((item)=> (<SearchSong song={item}/>))
        
        }
        </div>
    </div>
  )
}

export default Search