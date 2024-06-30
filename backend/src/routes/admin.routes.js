import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { login,registerAdmin,logoutAdmin,refreshAccessToken } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(upload.fields([
{
  name:"avatar",
  maxCount: 1,
},
{
  name:"coverImage",
  maxCount: 1,
}
]),registerAdmin)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT("Admin"),logoutAdmin)
router.route("/refresh-token").post(refreshAccessToken)



export default router;