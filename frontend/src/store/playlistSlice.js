import {createSlice} from '@reduxjs/toolkit'


const initialState= {
    playlist:[
        {
        playlistName:String,
        songs:[{
        }]
        }
    ]
 
}
export const playlistSlice = createSlice({
    name:"playlist",
    initialState,
    actions: {
        allPlaylist:(state,action )=> {
         state.playlists = action.payload;
        },
        editPlaylist:(state,action)=> {
            state.playlist = action.payload;
        }
    }
})


export default playlistSlice.reducer;

export const {allPlaylist,editPlaylist} =  playlistSlice.actions;
