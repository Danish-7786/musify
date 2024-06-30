
import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const songSchema =new Schema({
    songName : {
        type: String,
    },
    createdBy: {
        type:Schema.Types.ObjectId,
        ref: "Admin"
    },
    songFile: {
        type:String,//cloudinary url
    },
    songCover: {
        type:String,//cloudinary url
    },
    streams:{
        type:Number,
        default:0
    }
},
 {
    timestamps:true
 } 
)

songSchema.plugin(mongooseAggregatePaginate);
export const Song = mongoose.model("Song",songSchema)