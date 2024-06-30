import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import  LoginInput  from '../../LoginInput';
import axios from "axios";
import {useSelector,useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import { useForm } from 'react-hook-form';
const AdminSignup = () => {

const {register,handleSubmit} = useForm();
const navigate = useNavigate();
const dispatch = useDispatch();
  const [errorMsg,setError] = useState('')
 const user = useSelector((state)=> state.auth.userData)
  const SignupData = async(data)=> {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('creatorName',data.creatorName)
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('avatar', data.avatar[0]);
      formData.append('coverImage', data.coverImage[0]);

   
      const response = await axios.post('http://localhost:3000/api/v1/admin/register',formData,{
       headers:{'content-type':'multipart/form-data'},
       responseType:'json'
     })

     if(response) {navigate("/admin")
     const adminData = response.data.data;
     dispatch(adminData)
     Cookies.set("accessToken",adminData.accessToken)
     console.log(adminData);
    }
    } catch (error) {
      error = error.response.data.match(/<pre>(.*?)<br>/s)[1];
    setError(error)
    console.log(error);
      
    }
  }

  // const handleSubmit = async (e)=> {
  //   e.preventDefault();
  //  try {
  //   const formData = {
      // 'username':signup.username,
      // 'email':signup.email,
      // 'password':signup.password,
      // 'avatar':avatar,
      // 'coverImage':coverImage,
  // } // Append cover image file
  // console.log(formData);
  //    const response = await axios.post('http://localhost:3000/api/v1/users/register',formData,{
  //      headers:{'content-type':'multipart/form-data'},
  //      responseType:'json'
  //    })
  //    console.log(response);

  //  } 
  //  catch (error) {
  //   console.log(error);
  //  }
  // }
  
  return (
    <div className=' bg-gradient-to-b from-neutral-900 to-neutral-950 h-full w-full flex flex-col gap-0 md:gap-8 items-center overflow-hidden overflow-y-auto'>
      <div className='bg-black/80  text-white py-2 px-8 w-full'>
        <img src="./spotify.jpg" alt="" className ="h-24" />
      </div>

      <div className=' bg-gradient-to-b from-black/40 to-black/30 m-0 md:m-16 h-fit w-full p-4 text-white flex flex-col items-center md:rounded-lg  md:w-[45rem]'>
         
         <h1 className='text-white mt-14 text-4xl font-bold'>Sign up as a Spotify Creator</h1>
          {errorMsg && (<p>{errorMsg}</p>)}
         <form action='' onSubmit={handleSubmit(SignupData)} className='p-16 flex flex-col gap-8'>

            <LoginInput

            htmlFor="username" 
            name="username" 
            type="text" 
            Label="Username" 
            {...register("username",{
              required:true,
            })}
            />
             <LoginInput

htmlFor="creatorName" 
name="creatorName" 
type="text" 
Label="Creator Name" 
{...register("creatorName",{
  required:true,
})}
/>


          <LoginInput 
          htmlFor="email" 
          name="email" 
          type="email" 
          Label="Email"
          {...register("email",{
            required:true,
          })}
           />

          <LoginInput 
          htmlFor="password" 
          name="password" 
          type="password" 
          Label="Password"
          {...register("password",{
            required:true,
          })}
          />
          <LoginInput 
          htmlFor="avatar" 
          name="avatar" 
          type="file" 
          Label="Profile Image"
{...register("avatar",{
  required:true,
})}
          />

        <LoginInput 
          htmlFor="coverImage" 
          name="coverImage" 
          type="file" 
          Label="Cover Image"
          {...register("coverImage",{
            required:true,
          })}
          />
        
          
          
          {/* <label htmlFor="avatar"> Profile Image</label>
          <input type="file" onChange={(e)=> setImage(e.target.files[0])} />
          <label htmlFor="coverImage">cover Image</label>
          <input type="file" id=""onChange={(e)=> setCoverImage(e.target.files[0])} />  */}
          
      
           <button  type="submit" className='bg-green-500 text-black font-semibold py-2 rounded-sm hover:scale-105 transition' onClick={navigate("/admin")}>Sign up</button>
         </form>
         <div className='flex flex-col items-center'>
          <p className='text-neutral-600 font-medium'>Already have an account? </p>
          <Link to="/admin/login" className='underline'>Log in to Spotify for creators</Link>
           <Link to="/login" className='underline'>Log in for Spotify User</Link>
           <Link className=''></Link>
         </div>
      </div>
    </div>
  )
}
export default AdminSignup;