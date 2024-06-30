import React, { useEffect, useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import { IoPause, IoPlaySharp } from "react-icons/io5";
import { addArtist, setIsFollowed } from "../../../store/artistSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import TopSongs from "./TopSongs";
import { useDispatch, useSelector } from "react-redux";

const ArtistPage = () => {
  const { artistId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // State to track loading
  let user = useSelector((state) => state.artist.artistDetails);
  let { followers, coverImage, creatorName, avatar, isFollowed, songs } = user;
  console.log(isFollowed);
  const [isFollow, setIsFollow] = useState(isFollowed);
  const [isPlaying, setIsPlaying] = useState(false);
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    async function getUser() {
      try {
        let res = await axios.get(
          `http://localhost:3000/api/v1/follower/is-artist-followed/${artistId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (res) {
          const art = res.data.data;
          console.log(art);
          const artistDetails = {
            followers:
              art[0].artistFollowers?.length > 0
                ? art[0].artistFollowers[0]?.count
                : 0,
            avatar: art[1][0].avatar,
            coverImage: art[1][0].coverImage,
            creatorName: art[1][0].creatorName,
            songs: art[1][0].mySongs,
            isFollowed: art[0].followerFollowingArtist.length > 0,
          };

          dispatch(addArtist(artistDetails));
          setLoading(false); // Set loading to false once data is fetched
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, []);
  const handleFollow = async () => {
    try {
      let follow = await axios.post(
        `http://localhost:3000/api/v1/follower/follow-artist/${artistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (follow) {
        console.log(follow.data.data);
        const isFollowed = follow.data.data;
        setIsFollow(!isFollow);
        dispatch(setIsFollowed(isFollowed.isFollowed));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading screen
  }

  return (
    <div>
      <div className=" bg-neutral-900 h-screen text-white flex flex-col w-full  ">
        <div className="flex items-center  relative">
          <div className="w-full relative h-52 rounded-md overflow-hidden object-contain">
            <img
              className="w-full"
              src={coverImage || "http:placeholder-150"}
              alt="CoverImage"
              width="50"
            />

            <button className="bg-green-500 absolute bottom-1 right-2 text-white font-semibold p-2 rounded-md">
              <RiPencilFill />
            </button>
            <div className="absolute flex bottom-0 p-2 gap-2 flex-col">
              <span className=" text-white text-6xl font-bold ">
                {creatorName}
              </span>
              <span className=" text-white text-xs font-semibold ">{`${followers} Monthly listners`}</span>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div className="flex gap-4 items-center bg-gradient-to-b relative from-orange-800/50 to-orange-500/0 p-4">
              <button>
                <span className="icon bg-green-500  rounded-full p-4">
                  {isPlaying ? (
                    <IoPause size={24} />
                  ) : (
                    <IoPlaySharp size={24} />
                  )}
                </span>
              </button>
              <button
                className="px-4 py-1 h-8 rounded-full border-2"
                onClick={handleFollow}
              >
                {isFollowed ? "Following" : "Follow"}
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-xl ml-4 mb-4 ">Popular</h2>
            <div className="p-2">
              {songs.map((song, index) => (
                <TopSongs
                  key={index}
                  index={index + 1}
                  songFile={song.songFile}
                  songName={song.songName}
                  songCover={song.songCover}
                  streams={song.streams}
                  artist={user.creatorName}
                  song={song}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
