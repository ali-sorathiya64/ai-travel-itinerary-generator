import dotenv from "dotenv";
dotenv.config();

import {v2 as cloudinary} from "cloudinary";


cloudinary.config({

cloud_name:process.env.CLOUDINARY_CLOUD_NAME,

api_key:process.env.CLOUDINARY_API_KEY,

api_secret:process.env.CLOUDINARY_API_SECRET

});


const test = async()=>{

try{

const result = await cloudinary.api.ping();

console.log("Cloudinary working:", result);

}catch(error){

console.log("Cloudinary error:", error.message);

}

}


test();