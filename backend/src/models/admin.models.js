import mongoose,{Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const adminSchema = new Schema(
    {
        username: {
            type:String,
            required:[true, "Username is required"],
            unique: true,
            lowercase:true
        },
        creatorName: {
          type:String,
          required:[true, "creatorName is required"],
      
          lowercase:true
        },
        email : {
            type:String,
            
            required:true,
            lowercase:true,
        },
        
        password: {
        type:String,
        required: [true,"password is required"],
        },
        mySong: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Song'
        }]
        ,
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
adminSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})


adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}
adminSchema.methods.generateAccessToken = function(){
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
adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
      _id:this._id,
     
    },
     process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn :process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const Admin = mongoose.model("Admin",adminSchema)