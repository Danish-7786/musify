import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currSong: {
    songId:"",
    songName: "",
    artist: "",
    index: 0,
    isFav: false,
    songFile: "",
    songCover: "",
    songPlayed: false,

  },
  songList: [],
};

export const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    playPauseSong: (state) => {
      state.currSong.songPlayed = !state.currSong.songPlayed;
    },
    addSongtoList: (state, action) => {
      state.songList = action.payload;
    },
    playSong: (state, action) => {
      state.currSong = action.payload;
    },
    playNext: (state) => {
      const index = state.currSong.index;
      if (index === state.songList.length - 1) {
        state.currSong = state.songList[0];
      } else {
        state.currSong = state.songList[index + 1];
      }
    },
    playPrevious: (state) => {
      const index = state.currSong.index;
      if (index === 0) {
        state.currSong = state.songList[state.songList.length - 1];
      } else {
        state.currSong = state.songList[index - 1];
      }
    },
    addFavourite: (state, action) => {
      const isFav = action.payload;
      state.currSong.isFav = isFav;
      const index = state.currSong.index;
      if (state.songList[index]) {
        state.songList[index].isFav = isFav;
      }
    },
  },
});

export default musicSlice.reducer;
export const {
  playPauseSong,
  playSong,
  playNext,
  addSongtoList,
  addFavourite,
  playPrevious,
} = musicSlice.actions;