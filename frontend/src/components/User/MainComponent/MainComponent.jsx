import React,{useEffect} from "react";

import HomePageCard from "./HomePageCard";
import { loginUser } from "../../../store/authSlice";
import {useSelector,useDispatch} from "react-redux"
import Profile from "../Profile/Profile"
import Cookies from "js-cookie";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import Song from "../Song/Song";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
const MainComponent = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userData);
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
  return (
    <div className="bg-neutral-900 w-full h-full rounded-md overflow-y-auto">
      <div className="">
       
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
         <HomePageCard imgLink="https://i.scdn.co/image/ab67706f000000028094d49283ac9beb2d1e97cf" cardText={"Trending in India"}/>
         <HomePageCard imgLink="https://i.scdn.co/image/ab67706c0000bebb5722016e5bab71fa955fb739" cardText={"Bollywood Hits"}/>
         <HomePageCard imgLink="https://th.bing.com/th/id/OIP.P9gh2oPkWwEm1RmgUx7a4AHaHa?rs=1&pid=ImgDetMain" cardText={"Indie Pop"}/>
        </div>
        </div>
        <div>
            <h3 className="text-xl text-white p-4 font-bold">Made For You</h3>
        </div>
        <div>
          <Song/>
        </div>
    </div>
  );
};

export default MainComponent;
