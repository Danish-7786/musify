import React from 'react'
import {Link} from "react-router-dom"
const MainButton = ({btnText,className,urlText}) => {
  return (
    <button   className={`${className} px-4 py-2 rounded-full hover:scale-105`}>
      <Link to ={`/${urlText}`}>
        <p className='font-semibold'>{btnText}</p>
      </Link>
    </button>
  )
}

export default MainButton