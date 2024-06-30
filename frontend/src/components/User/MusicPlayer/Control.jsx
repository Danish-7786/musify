import React, { useCallback, useEffect, useState ,useRef} from "react";
import { FaPlay } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { IoPlayOutline } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { IoPause ,IoPlaySharp} from "react-icons/io5";
import { IoShuffle } from "react-icons/io5";
import { RxLoop } from "react-icons/rx";
import axios from "axios";

import "./MusicPlayer.css"
const Control = ({
  songFile,
  progressBarRef,
  audioRef,
  timeProgress,
  setTimeProgress,
  duration,
  setDuration,

}) => {
   
  
  const [isPlaying,setIsPlaying] = useState(false)
 
  const [progress,setProgress] = useState(0)
  const playAnimationRef = useRef();

  const repeat = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    // progressBarRef.current.value = ;
    setProgress((currentTime/duration)*100)
    // progressBarRef.current.style.setProperty(
    //   "--range-progress",
    //   `${(progressBarRef.current.value / duration) * 100}%`
    // );
    playAnimationRef.current = requestAnimationFrame(repeat)
  },[audioRef,duration,progressBarRef,setTimeProgress]);

  const onLoadedMetadata = () => {
    var audioTime = audioRef.current.duration;
    console.log(audioTime);
    setDuration(audioTime);
  };

  
const handlePrevious = () => {};

const handleNext = () => {};
  useEffect(() => {
    if (isPlaying) {
      // if isPlaying variable is true means
      // someone has played the music means audio.play()
      audioRef.current.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
      //
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  },[isPlaying,audioRef,repeat]);



  const formatTime = (duration) => {
    if (duration && !isNaN(duration)) {
      const minutes = Math.floor(duration / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(duration % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return `00:00`;
  };
  const handleProgressChange = (e) => {
    const currProg=progressBarRef.current.value;
  
    setProgress(currProg);
    console.log(
     progress
    );
    audioRef.current.currentTime = (currProg*duration)/100;
   console.log(duration);

    setTimeProgress((currProg*duration)/100);
  };
  return (
    <div className="flex ">
      <audio
        src={songFile}
        onLoadedMetadata={onLoadedMetadata}
        ref={audioRef}
      />

      <div className="flex justify-center flex-col md:w-[24rem] gap-2">
        <div className="flex gap-4 items-center md:gap-8 justify-center">
          <button className="" onClick={handlePrevious}>

          <IoShuffle size={20} />
          </button>
          <IoPlaySkipBackSharp size={24} />
          <button onClick={()=> 
              setIsPlaying(!isPlaying)
           } className="bg-white flex justify-center text-black rounded-full w-8 h-8 items-center ">
            <span className="icon">

          { isPlaying?<IoPause size={20}/>: <IoPlaySharp size={20}/>}
            </span>
          </button>
          <button className="" onClick={handleNext}>

          <IoPlaySkipForwardSharp size={24} />
          </button>
          <RxLoop />
        </div>
        {/* Progress Bar */}
        <div className="flex gap-2">
          <span> {formatTime(timeProgress)}</span>
          <input
            type="range"
            ref={progressBarRef}
            min={0}
            value={progress}
            className="bg-neutral-800 text-white w-full"
            onChange={(e)=> handleProgressChange()}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default Control;
