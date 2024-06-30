
import mongoose from "mongoose";
import DB_name from "../constants.js";


const connectDB = async ()=> {
    try {
        console.log(process.env.MONGODB_URI);
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
       if(connectionInstance){
           console.log("Mongodb successfully connected !!");
       }
         
        
    } catch (error) {
        console.log("Error in connecting with data base",error);
        process.exit(1) //The process.exit() method is used to
        // end the process which is running at the same time with an exit code in NodeJS.
        // 0 means end the process without any kind of failure and 1 means end the process 
        //with some failure.
    }
}

export default connectDB;