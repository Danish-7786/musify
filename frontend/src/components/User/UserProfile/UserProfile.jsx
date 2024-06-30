import React, { useEffect, useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import {IoIosArrowBack} from "react-icons/io";
import {IoIosArrowForward} from "react-icons/io";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
function UserProfile() {
  const navigate = useNavigate();
  const [user ,setUser] = useState([])
  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [fullName,setName] = useState(user.fullName)
  const [email,setEmail] = useState(user.email)

  useEffect(()=> {

    async function getUser() {
      const accessToken = Cookies.get("accessToken");
     try {

      let res = await axios.get("http://localhost:3000/api/v1/users/get-user",{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
       if(res) {
      
          setUser(res.data.data)
          setName(res.data.data.fullName);
          setEmail(res.data.data.email);
 
       } 
     } catch (error) {
      console.log(error);
     }
    }
    getUser()
  },[])

  const handlePlayer = async()=> {
    const accessToken = Cookies.get("accessToken");
    try {

     let res = await axios.post("http://localhost:3000/api/v1/users/update-profile",{fullName,email},{
       headers: {
         Authorization: `Bearer ${accessToken}`
       }
     })
      if(res) {
        console.log(res);
      } 
    } catch (error) {
     console.log(error);
    }

  }
 

  return (
    <div className="bg-neutral-900 h-screen text-white flex w-full  justify-center">
      <div className="p-8 flex flex-col gap-4">
        <div>
        <div className="flex gap-2 p-[6px] h-12">
          <button className="bg-black/80 text-white p-2 rounded-full " onClick={()=> navigate(-1)}>
            <IoIosArrowBack size={20} />
          </button>
          <button className="bg-black/80 text-white p-2 rounded-full">
            <IoIosArrowForward size={20} />
          </button>
        </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <div className="flex items-center mb-4 relative">
            <div className="w-full relative h-24 rounded-md overflow-hidden">
                <img className="w-full" src={user.coverImage|| "http:placeholder-150"} alt="CoverImage"  width="50"/>
                <button className="bg-green-500 absolute bottom-1 right-2 text-white font-semibold p-2 rounded-md">
            <RiPencilFill/>
          </button>
            </div>
            <div className="absolute bottom-[-1rem] left-[-1rem]">
    <div className="relative overflow-hidden">
          <img
            src={user.avatar}
            alt="Profile"
            className="rounded-full w-24 h-24 mr-4 border"
            />
          <button className="bg-green-500 absolute bottom-1 right-6 text-white font-semibold p-2 rounded-full">
            <RiPencilFill/>
          </button>
            </div>
            </div>
        </div>
        <div className="mt-4">
          <label className="block mb-2">Name:</label>
          <div className="w-[40rem]">
            {nameEdit ? (
                <div className="relative"> 
              <input
                type="text"
                className="bg-neutral-900 border-white/50 border-[2px] text-white rounded-md py-2 px-4 w-full"
                placeholder="Enter your username"
                value={fullName}
                onChange={(e)=> {setName(e.target.value)}
              }
                />
                <button className="absolute right-2 top-[5px] bg-green-500 p-2 rounded-md" onClick={(e)=> setNameEdit(!nameEdit)}>{ <FaCheck/>}</button>
                                                
                </div>
            ) : (
                <div className="relative " >

                <p className="bg-neutral-900 border-white/50 border-[2px] py-2 px-4 rounded-md">
               {fullName}
                </p>
                <button className="absolute right-2 top-[5px] bg-green-500 p-2 rounded-md" onClick={(e)=> setNameEdit(!nameEdit)}>{ <RiPencilFill/>}</button>
                  </div>
            )}
          </div>
        </div>
        <div className="mb-4 w-full">
          <label className="block mb-2">Email:</label>
          <div>
            {emailEdit ? (
                <div className="relative ">

              <input
                type="text"
                className="bg-neutral-900 text-white rounded-md py-2 px-4 w-full border-white/50 border-[2px]"
                placeholder="Enter your username"
                value={email}
                onChange={(e)=> {setEmail(e.target.value)}}
                
                />
                <button className="absolute right-2 top-[5px] bg-green-500 p-2 rounded-md" onClick={(e)=> setEmailEdit(!emailEdit)}>{ <FaCheck/>}</button>

                </div>
            ) : (
                <div className="relative " >

              <p className="bg-neutral-900 border-white/50 border-[2px] py-2 px-4 rounded-md">
             {email}
              </p>
              <button className="absolute right-2 top-[5px] bg-green-500 p-2 rounded-md" onClick={(e)=> setEmailEdit(!emailEdit)}>{ <RiPencilFill/>}</button>
                </div>
            )}
          </div>
        </div>
        <button className="bg-green-500 text-white font-semibold py-2 px-4 w-full rounded-md" onClick={handlePlayer} >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
