import multer from "multer";


const storage = multer.memoryStorage();


const upload = multer({

    storage,

    limits:{
        fileSize:10 * 1024 * 1024
    },

    fileFilter:(req,file,cb)=>{


        const allowed = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg"
        ];


        if(allowed.includes(file.mimetype)){

            cb(null,true);

        }else{

            cb(
                new Error("Only PDF and images allowed")
            );

        }

    }

})


export default upload;