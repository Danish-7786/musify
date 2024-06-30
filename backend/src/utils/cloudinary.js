import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
  });



const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        
        const response = await cloudinary.uploader.upload(""+localFilePath,
           {
            resource_type: "auto"
           } )
           
            fs.unlinkSync(localFilePath)
           return response
    }
    catch(error){
        // if our file is not uploaded on 
       // cloud than it would be stuck on our local server we need to remove it 
    //    fs,.unlinkSync here sync refers to synchronous means after removing file than move to next line is used to remove files
        fs.unlinkSync(localFilePath);
     
        return null;
        
    }
}






export {uploadOnCloudinary}