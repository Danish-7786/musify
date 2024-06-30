import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { addSongtoList } from "../../../store/musicSlice";
import { useDispatch, useSelector } from "react-redux";
import SongCard from "./SongCard";
import "./Song.css"
const Song = () => {
  const [isFav,setIsFav] = useState(false);
  const songs = useSelector((state) => state.music.songList);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchSong(){
    try {
      const accessToken = Cookies.get("accessToken");
      let response = await axios.get(
        "http://localhost:3000/api/v1/song/all-song",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response) {
        const song = response.data.data;
        dispatch(addSongtoList(song));
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchSong();
  }, []);
  return (
    <div className="grid grid-cols-4 overflow-y-auto">
      {songs?(songs.map((song,index) => (
        <SongCard index={index} key={song._id} song = {song}/>
      ))):("Please Login to view songs")}
    </div>
  );
};

export default Song;
