import React from 'react'
import { X } from 'lucide-react';

const EditPlaylist = ({image,editable,setEditable}) => {
  return (
    <div className='fixed flex justify-center items-center inset-0  backdrop-blur-sm  bg-black/30'>

    <div className='flex  flex-col bg-neutral-700 text-white p-6 rounded-md gap-4 '>
        <div className='flex justify-between'>
            <h1 className='font-bold'>Edit details</h1>
       <button onClick={(e)=> setEditable(false)}>
   <X/>

        </button>     
        </div>
        <div className='flex  gap-4'>

        <div className='flex '>
            <img src={image|| "../playlist.png"} alt="" />
            
        </div>
        <div className='flex flex-col gap-4'>
            
            <input type="text" name="" id="" placeholder='enter your playlist name' className='bg-neutral-600 outline-none py-1 px-2 rounded-md' />
          <textarea placeholder='enter your description'  className='bg-neutral-600 outline-none py-1 px-2 rounded-md resize-none' name="" id="" cols="30" rows="5"></textarea>
        </div>

        </div>
        <div className='flex justify-end mt-4'>

    <button className='bg-white text-black px-4 rounded-full py-1'onClick={(e)=> setEditable(false)}>Save</button>
        </div>
    </div>
    </div>
  )
}

export default EditPlaylist