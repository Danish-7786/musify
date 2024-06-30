import React from "react";

const SearchSong = ({song}) => {
    let {songCover,songName,artist,songDuration} = song;
    console.log(artist);
    artist = artist[0].creatorName;
    console.log(artist);

  return (
    <div className="flex gap-4 bg-slate-950 w-[90%] self-center rounded-md">
      <div className="w-14 h-12 overflow-hidden object-contain">
        <div className="overflow-hidden  object-cover rounded-md " >
          <img width={90} src={songCover} alt="" />
        </div>
      </div>
      <div>
        <div className="">
          <span className="font-semibold text-white">{songName}</span>
        </div>
        <span className="text-white text-sm">{artist}</span>
      </div>
      <span>{songDuration}</span>

    </div>
  );
};

export default SearchSong;
