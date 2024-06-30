import { Router } from "express";
import {allSongs, searchSong, uploadSong, viewMySongs} from "../controllers/song.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();


router.route("/upload-song").post(verifyJWT("Admin"),upload.fields([
    {
   name: "songFile",
   maxCount:1,
   },
   {
    name:"songCover",
    maxCount:1,
   }
]),uploadSong)
router.route("/view-my-songs").get(verifyJWT("Admin"),viewMySongs)
router.route("/all-song").get(verifyJWT("User"),allSongs)
router.route("/search-song/:songName").get(verifyJWT("User"),searchSong)
export default router;