import React from 'react'

const HomePageCard = ({imgLink,cardText}) => {
  return (
    <div className='md:h-14 h-10 w-full flex items-center bg-black/50 gap-4 rounded-md overflow-hidden text-white'>
        <img src={imgLink} alt=""  className='h-full' />
        <p>{cardText}</p>

    </div>
  )
}

export default HomePageCard