import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/User/Sidebar/Sidebar';
import {useDispatch,useSelector} from 'react-redux'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MainButton from './components/User/MainComponent/MainButton';
import MusicPlayer from './components/User/MusicPlayer/MusicPlayer';
import Profile from './components/User/Profile/Profile';
import {useNavigate} from "react-router-dom"
import { loginUser } from "./store/authSlice"
import Cookies from "js-cookie"
export const Layout = () => {
  const user = useSelector((state) => state.auth.userData);

  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';
  const isSignupRoute = location.pathname === "/signup";
  const isAdminRoute = location.pathname.startsWith("/admin");
 const isArtistPage = location.pathname.startsWith("/artist");
  const [loading,setLoading] = useState(true)
  // useEffect is working
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchUser(){
    const accessToken =Cookies.get("accessToken");
    console.log(accessToken);
    try {
      let response = await axios.post("http://localhost:3000/api/v1/users/authenticate",
      {accessToken},{
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(response) dispatch(loginUser(response.data.data))
    } catch (error) {
     console.log(error);
    }
  }
    fetchUser()
  }, []);

  const dispatch = useDispatch() 
  useEffect(()=> {
    
   },[]
  )

  return (
    <>
      <div className='relative bg-black w-screen h-screen flex p-2  overflow-hidden gap-2'>
        {!(isLoginRoute || isSignupRoute || isAdminRoute) && (
          <div className='resize-x hidden w-96 cursor-pointer md:block '>
            <Sidebar/>
          </div>
        )}
        <main className='w-full bg-gradient-to-b from-orange-500 to-orange-500/40'>
        {!(isLoginRoute || isSignupRoute || isAdminRoute || isArtistPage) && (
        <div className="flex flex-col gap-4 p-4">

        <div className="flex justify-between">
        <div className="flex gap-2 p-[6px] h-12">
          <button className="bg-black/80 text-white p-2 rounded-full " onClick={()=>navigate(-1)}>
            <IoIosArrowBack size={20} />
          </button>
          <button className="bg-black/80 text-white p-2 rounded-full" onClick={()=>navigate(+1)}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
        {user ? (<Profile/>):
        (
          <div>
         <MainButton urlText="login" btnText="login" className={"text-white/80"} />
         <MainButton urlText="signup" btnText="SignUp" className={"bg-white text-black/80"} />
        </div>
        )}
        </div>
        </div>
          )
        }
        <Outlet/>
        </main>
        {!(isLoginRoute || isSignupRoute || isAdminRoute) && (<div className='absolute block bottom-0 w-full bg-neutral-900'>
          <MusicPlayer/>
          </div>)}
      </div>
    </>

  );
};
