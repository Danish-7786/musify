import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   artistDetails: {
    followers:0,
    avatar:"",
    coverImage: "",
    creatorName:"",
    songs:[],
    isFollowed:false
   }
  }
export const artistSlice = createSlice({
    name: "artist",
    initialState,
    reducers: {
        addArtist:(state,action)=> {
         state.artistDetails = action.payload;
        },
        setIsFollowed:(state,action)=> {
            state.artistDetails.isFollowed= action.payload
        }
    }
})

export default artistSlice.reducer;
export const {addArtist,setIsFollowed}=  artistSlice.actions;
