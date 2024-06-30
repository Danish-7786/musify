import { Admin } from "../models/admin.models.js";
import { Song } from "../models/song.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadSong = asyncHandler(async(req,res)=> {
    const {songName} =req.body;
    if(!songName){
       throw new ApiError(404,"Please enter song Name")
    }
    const songFilePath = req.files?.songFile[0]?.path;
    const songCoverPath = req.files?.songCover[0]?.path;
    if(!songFilePath){
        throw new ApiError(404,"cant find the song")
    }
    const songFile = await uploadOnCloudinary(songFilePath);
    const songCover = await uploadOnCloudinary(songCoverPath);
    if(!songFile){
        throw new ApiError(404,"Song file is required")
    }

    const admin = await Admin.findById(req.user._id);
    const song =await Song.create({
        songName,
        songFile:songFile.url,
        songCover:songCover.url|| "",
        createdBy:admin
    })
    
    console.log(admin);
    admin.mySong?.push(song);
   
    await song.save();
    await admin.save();

    return res.status(200)
    .json(new ApiResponse(200,song,"Song successfully uploaded"))

})

const viewMySongs = asyncHandler(async(req,res)=> {
     const adminId = req.user._id;
     const songs = await Admin.findById(adminId).populate("mySong");
     
     return res.json( new ApiResponse(200,songs,"song successfully fetched"))
})
const allSongs = asyncHandler(async(req,res)=> {
    const song = await Song.aggregate([
        {
            $match:{
                _id:{
                    $exists:true,   
                }   
            }
        },

        {
            $lookup: {
                from:"admins",
                localField:"createdBy",
                foreignField:"_id",
                as:"artist",
                pipeline:[
                    {
                        $project:{
                            creatorName:1,
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"song",
                as:"likedSongs"
            }
        },
        {
            // we will get is array of objects as artist so wrap it we use unwind
             $unwind:"$artist",
        },
      
        {
            $addFields:{
               isFav: {
                $cond: {
                    if:{$in:[req.user?._id,"$likedSongs.user"] },
                    then:true,
                    else:false
                   }
                }     
            }
        }
    ])
    console.log(song);
 return res.json(new ApiResponse(200,song,"All songs fetched"))
})


const searchSong= asyncHandler(async(req,res)=> {
    console.log(req.params.songName);
    const song = await Song.find({
        "$or":[
              {"songName": {$regex:req.params.songName}}            
        ]
    })
    const son = await Song.aggregate([
       { 
        $match:{
            songName:{$regex: req.params.songName, $options: 'i'}
        }
    },
    {
        $lookup: {
            from:"admins",
            localField:"createdBy",
            foreignField:"_id",
            as:"artist",
            pipeline:[
                {
                    $project:{
                        creatorName:1,
                    }
                }
            ]
        }
    },
   

    ])
    if(!son){
        throw new ApiError(403,"Error in fetching song")
    }
    res.status(200).json(new ApiResponse(200,{son},"song found"))
    
})
export {
    uploadSong,
    viewMySongs,
    allSongs,
    searchSong
}

