import React from 'react'

const StatCard = ({title,data}) => {
  return (
    <div>
         <div className='bg-neutral-800 text-white p-5 w-[12rem] md:w-[15rem] rounded-md hover:text-orange-500 '>
                <h3 className='text-xl font-semibold'> {title}</h3>
                    <p>{data}</p>
            </div>
    </div>
  )
}

export default StatCard