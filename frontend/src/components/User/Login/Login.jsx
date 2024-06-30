import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link,useNavigate } from "react-router-dom";
import LoginInput from "../../LoginInput.jsx";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/authSlice.js";
import Cookies from "js-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [errorMsg, setError] = useState("");
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.userData);
  console.log(user);


  const SetCookie = () => {
    console.log(Cookies.get("refreshToken"));
  };
  const handleLogin = async (data) => {
    // e.preventDefault();
    console.log(":inside");
    console.log(data);

    
    try {
      let response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        data
      );
      const userData = response.data.data;
      console.log("response", userData);
      if (userData) {
        console.log("Hello");
        dispatch(loginUser(userData));
        console.log(user);
        navigate("/")
        console.log("user AT",userData.accessToken);
        Cookies.set("accessToken", userData.accessToken);
      }
      console.log(Cookies.get("accessToken"));
    } catch (error) {
      error = error.response.data.match(/<pre>(.*?)<br>/s)[1];
      setError(error);
    }
  };

  return (
    <div className=" bg-gradient-to-b from-neutral-900 to-neutral-950 h-full w-full flex flex-col gap-0 md:gap-8 items-center overflow-hidden overflow-y-auto">
      <div className="bg-black text-white p-2 px-8 w-full">
        <img src="spotify.jpg" alt="spotify" className="h-24" />
      </div>
      <div className=" bg-gradient-to-b from-black/40 to-black/30 m-0 md:m-16 h-full md:h-fit w-full p-4 text-white flex flex-col items-center md:rounded-lg  md:w-[45rem]">
        <h1 className="text-white mt-14 text-4xl font-bold">
          Log in to Spotify 
        </h1>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <form
          action="post"
          onSubmit={handleSubmit(handleLogin)}
          className="p-16 flex flex-col gap-8"
        >
          <LoginInput
            htmlFor="email"
            type="email"
            Label="Email or Username"
            name="email"
            {...register("email", {
              required: true,
              // validate:{
              //   matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
              //   "Email address must be a valid address",
              // }
            })}
          />
          <LoginInput
            htmlFor="password"
            type="password"
            Label="Password"
            name="password"
            {...register("password", {
              required: true,
            })}
          />
          {/* we are using forwardRef here cause our input is in 
            different component and we want state of it in here so we use 
            -forwardRef which give refernce of it so anything we change here will affect the main input  */}
          <button
            type="submit"
            className="bg-green-500 text-black font-semibold py-2 rounded-sm transition hover:scale-105"
          >
            Log in
          </button>
        </form>
        <div className="flex flex-col items-center">
          <p className="text-neutral-600 font-medium">
            Don't have an account ?{" "}
          </p>
          <Link to="/signup" className="underline">
            Sign up for Spotify
          </Link>
          <Link to="/admin/signup" className="underline">
            Sign up for Spotify Creator
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
