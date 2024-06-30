import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoginInput from "../../LoginInput"
import { useForm } from "react-hook-form";
import Cookies from "js-cookie"
import axios from "axios"

const AddSong = () => {
    const {register,handleSubmit }= useForm();
    const [open, setOpen] = React.useState(false);
   
    const uploadSong = async (data) => {
        // e.preventDefault()
        console.log(data);
        const formData = new FormData();
        formData.append('songName', data.songName);
        formData.append('songFile',data.songFile[0])
        formData.append('songCover', data.songCover[0]);
      
        const accessToken =  Cookies.get("adminAccessToken");
        console.log(accessToken);
       
        try {
          let response = await axios.post(
            "http://localhost:3000/api/v1/song/upload-song",
            formData,{
                headers:{
    
                    'Authorization': `Bearer ${accessToken}`
                },
                responseType:'json'
              }
          );
          const userData = response.data.data;
          console.log("response", userData);
          if (userData) {
            console.log("Hello");
          
            handleClose()
            console.log("user AT",userData.accessToken);
            Cookies.set("accessToken", userData.accessToken);
          }
          console.log(Cookies.get("accessToken"));
        } catch (error) {
            console.log(error);
          error = error.response?.data?.match(/<pre>(.*?)<br>/s)[1];
          
        }
      };
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

  return (
    <div className='w-full bg-neutral-800 mt-4 rounded-md h-full text-white '>
        <h1 className='text-2xl font-semibold text-center py-4'>
            
        Recorded A New Song Upload it Now !
        </h1>
        <div className='w-full flex justify-center py-12 '>
        <Dialog
              open={open}
              onClose={handleClose}
             
            >
          <form onSubmit={handleSubmit(uploadSong)}>
              <DialogTitle className="font-bold bg-neutral-900 text-green-500 ">Upload Your Song</DialogTitle>
              <DialogContent className=' flex flex-col gap-4 px-8 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white'>

            <LoginInput
            htmlFor="SongName"
            type="text"
            Label="Song Name"
            name="songName"
            {...register("songName")}
            />
            <LoginInput
            htmlFor=""
            type="file"
            Label="Upload Your Song"
            name="songFile"
            {...register("songFile")}
            />
            <LoginInput
             htmlFor=""
             type="file"
             Label="Song Cover"
             name="songCover"
             {...register("songCover")}
            />
              </DialogContent>
              <DialogActions className='bg-neutral-950 '>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Upload</Button>
              </DialogActions>
            </form>
            </Dialog>
        <button className='bg-green-500 px-8 py-3 rounded-sm font-semibold' onClick={handleClickOpen}>Add Song</button>
        </div>
        </div>
  )
}
export default AddSong