import { Admin } from "../models/admin.models.js";
import { Song } from "../models/song.models.js";
import { Follower } from "../models/follower.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pipeline } from "stream";

import mongoose from "mongoose";

const isArtistFollowed = asyncHandler(async (req, res) => {
  // Replace this with the actual artist ID you want to search for
  const creatorName = req.params.artistId;
  const FollowerID = req.user?._id; // Replace this with the actual follower ID you want to search for
  let artist = await Admin.aggregate([
    {
      $match: {
        creatorName: creatorName,
      },
    },
    {
      $lookup: {
        from: "songs",
        localField: "mySong",
        foreignField: "_id",
        as: "mySongs",
        pipeline:[
            {
                $lookup:{
                    from :"likes",
                    localField:"_id",
                    foreignField:"song",
                    as:"LikedSongs"
                }

            },
            {
                $addFields:{
                    isFav:{
                        $cond:{
                            if:{$in:[req.user?._id,"$LikedSongs.user"]},
                            then:true,
                            else:false
                        }
                    }
                }
            }
        ]
      },
    },
  
    {
      $project: {
        creatorName: 1,
        coverImage: 1,
        mySongs: 1,
      },
    },
  ]);
  // if(!artist?.length){
  //     throw new ApiError(402,"Error occured during fetching artist")
  // }
  console.log(artist);
  const ArtistID = artist[0]._id;
  console.log(ArtistID);
  if (!ArtistID) {
    throw new ApiError(403, "No artist Found");
  }

  console.log(ArtistID);
  let artistdet = [];

  try {
    artistdet = await Follower.aggregate([
      {
        $match: {
          artist: new mongoose.Types.ObjectId(ArtistID),
        },
      },
      {
        $facet: {
          artistFollowers: [
            {
              $match: {
                artist: new mongoose.Types.ObjectId(ArtistID),
              },
            },
            // Assuming "Artist" is the name of your artist collection
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          followerFollowingArtist: [
            {
              $match: {
                artist: new mongoose.Types.ObjectId(ArtistID),
                follower: new mongoose.Types.ObjectId(FollowerID),
              },
            },
            {
              $addFields: {
                isFollowing: { $literal: true },
              },
            },
          ],
        },
      },
    ]);

    artistdet.push(artist);
  } catch (err) {
    throw new ApiError(404, err);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, artistdet, "artist Details fetched"));
});

const followArtist = asyncHandler(async (req, res) => {
  const user = req.user?.id;
  const { artistId } = req.params;

  const artist = await Admin.findOne({ creatorName: artistId });
  if (!artist) {
    throw new ApiError(403, "No such artist exist");
  }
  const follower = await Follower.aggregate([
    {
      $match: {
        follower: new mongoose.Types.ObjectId(user),
        artist: new mongoose.Types.ObjectId(artist._id),
      },
    },
  ]);
  const followerdelete = await Follower.deleteOne({
    follower: new mongoose.Types.ObjectId(user),
    artist: new mongoose.Types.ObjectId(artist._id),
  });
  console.log("follower", followerdelete);
  if (followerdelete?.deletedCount > 0) {
    return res.json(
      new ApiResponse(
        200,
        { isFollowed: false },
        "follower unfollowed Successfully"
      )
    );
  }
  const followCard = await Follower.create({
    follower: user,
    artist,
  });
  console.log(followCard);
  if (followCard?.length) {
    throw new ApiError(402, "Error in handling ");
  }
  return res.json(new ApiResponse(200, { isFollowed: true }, "success"));
});

export { isArtistFollowed, followArtist };
