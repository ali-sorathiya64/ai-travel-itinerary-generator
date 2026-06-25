import cloudinary from "../config/cloudinary.js";


export const uploadToCloudinary = (file)=>{


return new Promise((resolve,reject)=>{


cloudinary.uploader.upload_stream(

{
    folder:"travel-documents",
    resource_type:"raw"
},

(error,result)=>{


if(error){

reject(error)

}else{

resolve(result)

}


}

).end(file.buffer)

})

}