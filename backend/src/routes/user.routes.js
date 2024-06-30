import {Router} from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken, authenticateUser, addToFavourite, updateUserPassword, editProfile, updateUserAvatar, updateUserCoverImage, getUserDetails, createPlayList, getPlaylist} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()
router.route("/register").post(upload.fields([
{   name: "avatar",
    maxcount: 1
},
{
    name: "coverImage",
    maxcount:1
}
]),registerUser)


router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT("User"),logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/authenticate").post(authenticateUser)
router.route("/add-fav").post(verifyJWT("User"),addToFavourite);

router.route("/update-password").post(verifyJWT("User"),updateUserPassword)
router.route("/update-profile").post(verifyJWT("User"),editProfile)
router.route("/update-avatar").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    }
]),verifyJWT("User"),updateUserAvatar)
router.route("/update-coverimage").post(upload.fields([
    {
        name:"coverImage",
        maxCount:1
    }
]),verifyJWT("User"),updateUserCoverImage)
router.route("/get-user").get(verifyJWT("User"),getUserDetails);
router.route("/create-playlist").post(verifyJWT("User"),createPlayList)
router.route("/get-playlist").get(verifyJWT("User"),getPlaylist)
export default router;