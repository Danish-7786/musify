import { Router } from "express";
import { followArtist, isArtistFollowed} from "../controllers/follower.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/is-artist-followed/:artistId").get(verifyJWT("User"),isArtistFollowed);
router.route("/follow-artist/:artistId").post(verifyJWT("User"),followArtist);



export default router;