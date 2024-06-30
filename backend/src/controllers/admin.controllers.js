import {Admin} from "../models/admin.models.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const options = {
  httpOnly:true,
  secure:true,
}
const generateTokens = async(adminId)=> {
  try{
  const admin = await Admin.findById(adminId);
  const accessToken=  admin.generateAccessToken();
  console.log(accessToken);
  const refreshToken=  admin.generateRefreshToken();
  admin.refreshToken = refreshToken;
  await admin.save({validateBeforeSave: false});
  return {accessToken,refreshToken}
}
catch(err){
  throw  new ApiError(500,"something went wrong while generating refresh and access token")
}

}

const registerAdmin = asyncHandler(async(req,res)=> {
      const {username,creatorName,email,password} = req.body;
   
      if([username,creatorName,email,password].some((field)=> field?.trim =="")){
           throw ApiError(404,"All fields are required")
      };

      const existedAdmin = await Admin.findOne({
        $or : [{username},{email}]
      })
      console.log(existedAdmin);
      if(existedAdmin){
        throw new ApiError(404,`User with this email or username exists`)
      }
      const avatarLocalPath = req.files?.avatar[0]?.path;
      const coverIamgeLocalPath = req.files?.coverImage[0]?.path;
      if(!avatarLocalPath){
        throw new ApiError(401,"Avatar Image is required");

      }
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      const coverImage = await uploadOnCloudinary(coverIamgeLocalPath)

      if(!avatar){
      throw new ApiError(401,"Avatar Image is required");
      }
      
      const admin = await Admin.create({
        avatar:avatar.url,
        coverImage: coverImage.url || "",
        username:username.toLowerCase(),
        creatorName,
        email,
        password
      })
    console.log("admin",admin);
      const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken")
      console.log("created",createdAdmin);
    
      return res.status(200)
      .json( new ApiResponse(200, createdAdmin,"creator Successfully registered"))
      
})



 const login = asyncHandler(async(req,res)=> {
  const {email,password} = req.body;
  if([email,password].some((field)=> field?.trim === "")){
   throw new ApiError(405,"All fields are required") 
  }
  const admin = await Admin.findOne({email});
  if(!admin){
    throw new ApiError(404,"User with this email or password doesnt exists")
  }
  const isPasswordCorrect = admin.isPasswordCorrect(password);
  if(!isPasswordCorrect){
    throw new ApiError(400,"Enter a valid password");

  }

  const {accessToken,refreshToken} = await generateTokens(admin._id);
console.log("acess",accessToken);
  return res
  .cookie("accessToken",accessToken)
  .cookie("refreshToken",refreshToken)
  .json(
    new ApiResponse(200,{
     
      accessToken,
   refreshToken},"user logged in sucess")
  )
 })



 const logoutAdmin = asyncHandler(async(req,res)=> {
  await Admin.findByIdAndUpdate(
  req.user._id ,
    {$set: {
      refreshToken:undefined,
   }},
 )

  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged Out Successfully"))

  })

  const refreshAccessToken = asyncHandler(async(req,res)=> {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const decoded = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
    const admin = await Admin.findById(decoded._id);
    if(admin.refreshToken !== token){
      throw new ApiError(404," Invalid token")
    }
    const {accessToken,newRefreshToken} = generateTokens(admin._id);
   return res.cookies("accessToken",accessToken,options)
   .cookies("refreshToken",newRefreshToken,options)
   .json(new Response(200,{accessToken,refreshToken:newRefreshToken},"User accessToken successfully refreshed"))
  })

  const getArtistDetails = asyncHandler(async(req,res)=> {
    // const {username} = req.params;
       const artistDetails = await Admin.aggregate([
      {
         $match: {
            _id:new mongoose.Types.ObjectId(req.user?._id)
            // here we are creating object of an id cause id we get as a req.user is string and id we pass in mongodb is object
         }
      },
      {
         $lookup: {
            from:"followers",
            localField: "_id",
            foreignField:"artist",
            as:"followers"
         }
      },
      {
    $lookup: {
      from:"songs",
      localField: "_id",
      foreignField:"createdBy",
      as:"mySongs"
    }
      },
      {
         $addFields: {
            myFollowing:{
               $size:"$followers",
               $first:"$mySongs"
            }
         }
      },
      {
         $project: {
            fullName:1,
            username:1,
            followers:1,
            mySongs:1,
            avatar:1,
            coverImage:1,
            email:1
         }
      }
   ])
   if(!artistDetails?.length){
    throw new ApiError(404,"artist Didnt exist")
   }
   return new ApiResponse(200,artistDetails,"artist fetched successfully")

  })
  

  // const getArtistSongs = asyncHandler(async(req,res)=>{
  //    const {username} =req.params;
  //    if(!username){
  //     throw new ApiError(403,"Username not found")
  //    }
  //    const mySongs = await Admin.aggregate([
  //     {
  //        $match: {
  //           _id:new mongoose.Types.ObjectId(req.user?._id)
  //           // here we are creating object of an id cause id we get as a req.user is string and id we pass in mongodb is object
  //        }
  //     },
  //     {
  //        $lookup: {
  //           from:"songs",
  //           localField: "_id",
  //           foreignField:"createdBy",
  //           as:"mySongs"
  //        }

  //     },
  //     {
  //        $addFields: {
  //           myFollowing:{
  //              $first:"$mySongs"
  //           }
  //        }
  //     },
  //     {
  //        $project: {
  //           fullName:1,
  //           username:1,
  //           myFollowing:1,
  //           avatar:1,
  //           coverImage:1,
  //           email:1
  //        }
  //     }
  //  ])
  // })
 export {
  login,
  registerAdmin,
  logoutAdmin,
  refreshAccessToken,
  getArtistDetails
 }