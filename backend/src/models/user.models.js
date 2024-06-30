import  mongoose,{Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {

        username: {
            type:String,
            required:[true, "Username is required"],
            unique: true,
            lowercase:true
        },
        fullName : {
           type:String
        },
        email : {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        password: {
        type:String,
        required: [true,"password is required"],
        },
        playlist: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist'
          }

        ],
        likedSong: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Song'
        }],
        avatar: {
          type:String,
          required:true,
        },
        coverImage: {
          type: String,

        },
        refreshToken: {
          type: String
      }
    },
    {
        timestamps:true
    }
)
// it is used to apply some function just before our data is saing
// here we cant apply arrow function cause it didnt have (this reference) access 
// bcrypt takes two argument i.e. what to hash and how many rounds of encryption
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
      return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username
      },
       process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn :process.env.ACCESS_TOKEN_EXIPRY
      }
      )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
      _id:this._id,
      email:this.email,
      username:this.username
    },
     process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User",userSchema)