import {configureStore} from '@reduxjs/toolkit'
import authSlice from "./authSlice"
import adminSlice from './adminSlice'
import  musicSlice  from './musicSlice'
import playlistSlice from './playlistSlice'
import  artistSlice from './artistSlice'


export const store = configureStore({
    reducer:{
        auth:authSlice,
        admin:adminSlice,
        music :musicSlice,
        playlist:playlistSlice,
        artist:artistSlice
    }
})