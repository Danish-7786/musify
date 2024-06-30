import mongoose,{Schema} from "mongoose"

const likeSchema =new Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song" 
    }
    
},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)