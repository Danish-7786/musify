import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // here cb is callback
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    //   keeping original file name is  bad option
    }
  })
  
 export const upload = multer({
     storage,
    })