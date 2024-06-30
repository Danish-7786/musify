import React from 'react'
import { IoMdHome } from "react-icons/io";
import {FaSearch} from "react-icons/fa"
import NavbarButton from './NavbarButton.jsx';
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
const Navbar = () => {

  const navigate = useNavigate();
  return (
    <>


    <div className='h-28 bg-neutral-900 rounded-lg'>
      <div className='flex flex-col gap-6 p-4'>

   <NavbarButton onClick={(e)=>navigate("/")} title = "Home" navbarIcon={<IoMdHome size ={22}/>}/>
    <NavbarButton onClick={(e)=> navigate("/search")} title="Search" navbarIcon={<FaSearch size={18} />}/>
    </div>

    </div>
    </>
  )
}

export default Navbar