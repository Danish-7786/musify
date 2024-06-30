import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.models.js";
import { Like } from "../models/like.models.js";
import { channel } from "diagnostics_channel";
import mongoose from "mongoose";
// by applying these options we ensure that frontend cant modify this cookies in we can only modify it with backend

const options = {
  httpOnly: true,
  secure: true,
};
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    // here we took the object of user from mongodb and store it in user
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // now these access token are generated in our system but not stored in database
    // now you can store the user but as soon as we will create the user it will ask for some required fields also such as password
    // so we use
    user.refreshToken = refreshToken;
    // here in the user object it has a field for refreshToken as we created while creating User Schema
    // so we store it easily in it
    await user.save({ validateBeforeSave: false });
    // so it will not validate before saving
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  //  get data from user form frontend
  // check if user already regstered
  // upload avatar img and get url from cloudinary
  // check if avatar is properly uploaded
  // save the user on mongodb
  // return the response to frontend

  const { username, email, password } = req.body;
  console.log("email:", email);
  console.log("username", username);
  console.log("password: ", password);
  //    if any of the field is empty it will return true
  // trim will remove whitespaces
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  //  $ by using dollar sign we can use many operators such or,and etc

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already existed");
  }
  // middle ware mostly adds more field to req here we get files access by multer
  // .avatar is fileName
  //  avatar[0] is first property has one object we will take it optionally cause may be we didnt get it
  //  so we will get path fromm that object
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);

  // localPath means our is on our server but not yet uploaded on cloudinary
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required multer");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);
  // if our image is not properly added on cloudinary(our database) than error might come
  // so we will check if avatar is uploaded properly or not else throw error
  if (!avatar) {
    throw new ApiError(400, "Avatar is required cloud");
  }
  const user = await User.create({
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // finding user by id if user is created then we will get the user
  // means user is successfully created
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user with this email or username doesnt exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "please enter a valid password");
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);
  // we have generated accesstoken and refresh but we have not set in our user
  // in generate functio we have saved user with accessTokens but here we dont have acess to that
  // updated User
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //cookie is also used to send accesstokens to frontend
  // use cookieparser package for sending cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
  // in above we have send access token and refresh token through cookies
  // but we are sending it in response again so that if user wants to access refresh token manually user can access it for some use
});
const authenticateUser = asyncHandler(async (req, res) => {
  const accessToken = req.body.accessToken;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    throw new ApiError(403, "Not an authenticated User");
  }
  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  let user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(401, "No account found");
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "User Logged In Successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });
  console.log(user);

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async () => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  // may be the user is sending refershToken from app so we take req.body
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!decoded) {
    throw new ApiError(401, "invalid access Token");
  }
  const user = await User.findById(decoded._id);

  //  checking if user we got user from decoded id then check if incoming refresh token and refrsh token user having is same
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }
  const { accessToken, newRefreshToken } = generateTokens(user._id);
  res
    .cookies("accessToken", accessToken, options)
    .cookies("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(200, {
        accessToken,
        refershToken: newRefreshToken,
      })
    );
});

const addToFavourite = asyncHandler(async (req, res) => {
  let songId = req.body;
  console.log(req.user?._id);
  
  console.log("songid", songId.songId);
  const favCheck = await Like.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user?._id),
        song: new mongoose.Types.ObjectId(songId.songId),
      },
    },
  ]);
  console.log("fav check", favCheck);
  if (!favCheck?.length) {
    const like = await Like.create({
      user: req.user?._id,
      song: songId.songId,
    });
    console.log("like in", like);
    return res
      .status(200)
      .json(new ApiResponse(200, { isFav: true }, "song added to favourites "));
  }
  const deleteResult = await Like.deleteMany({
    user: req.user?._id,
    song:songId.songId
  });
  console.log("like", deleteResult);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isFav: false }, "Song removed from Favourites")
    );
});



const editProfile = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log(fullName + "fullname" + email + " Email");
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      fullName: fullName,
      email: email,
    },
  }).select("-password");
  user.save();
  if (!user) throw new ApiError(403, "Unauthorized Req");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated"));
});
const updateUserPassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    throw new ApiError(400, "Enter the password man!");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "Unauth User");
  }
  const isPasswordCorrect = user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is not Correct");
  }
  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  return res.json(new ApiResponse(200, {}, "User Successfully Updated"));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -accessToken -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Successfully fetched"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Avatar is not uploaded properly");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: avatar.url,
    },
  }).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Avatar is not uploaded properly");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: coverImage.url,
    },
  }).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const createPlayList = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const length = user.playlist.length;
  const playlistName = `My PlayList #${length + 1}`;
  const playlist = await Playlist.create({
    playlistName,
  });
  user.playlist.push(playlist);
  console.log(playlist);
  await user.save();
  let userplaylist = await user.populate("playlist");
  userplaylist = userplaylist.playlist;

  return res
    .status(200)
    .json(new ApiResponse(200, userplaylist, "playlist added"));
});

const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await User.findById(req.user._id).select(
    "-password -refreshToken -accessToken -coverImage -avatar -email"
  );
  await playlist.populate("playlist");
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlists fetched"));
});

const getMyFollowers = asyncHandler(async (req, res) => {
  // const {username} = req.params
  // if(!username?.trim()){
  //    throw new ApiError(400,"username is missing")
  // }
  const myFollowers = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
        // here we are creating object of an id cause id we get as a req.user is string and id we pass in mongodb is object
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "follower",
        as: "myFollowing",
      },
    },
    {
      $addFields: {
        myFollowing: {
          $first: "$myFollowing",
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        myFollowing: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);
  if (!myFollowers.length) {
    throw new ApiError(404, "myFollwers didnt exist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, myFollowers, "User folloing successfully fetched")
    );
});

const isArtistFollowed = asyncHandler(async (req, res) => {
  const artist = await User.aggregate([
    {
      $match: {
        id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "follower",
        as: "myFollowing",
        pipeline: [
          {
            $match: {
              id: new mongoose.Types.ObjectId(req.user?._id),
            },
          },
        ],
      },
    },
  ]);
  console.log(artist);
  if (!artist?.length) {
    throw new ApiError(403, "no followers");
  }
  return new ApiResponse(200, artist, "artist fetched");
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  authenticateUser,
  addToFavourite,
  
  updateUserPassword,
  updateUserAvatar,
  updateUserCoverImage,
  editProfile,
  getUserDetails,
  createPlayList,
  getPlaylist,
  getMyFollowers,
  isArtistFollowed,
};
