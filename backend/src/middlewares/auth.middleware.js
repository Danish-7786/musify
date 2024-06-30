import { AsyncLocalStorage } from "async_hooks"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.models.js"
import { User } from "../models/user.models.js"


// when response is not in use we write _ instead of res
export const verifyJWT =(givenUser)=> { 

    return asyncHandler(async(req,_,next)=> {
    // req.cookies accessing data from cookies and ? denotes optional means there is a probability 
    // maybe user has stored accessToken in localStorage and would be passing token by himself
    
    try {
        let user ;
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        // here we dont want Bearer we only want token so we will replace Bearer with empty string ""
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        if(givenUser == "Admin"){
         
             user = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
        }
        else{
           
            user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        }
        if(!user){
            throw new ApiError(401,"Invalid AccessToken ")
        }
        // here we add a new parameter to req i.e. req.user which stores current user data
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid AccessToken")
    }
}) }      