import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../config/config.js";

dotenv.config();


const connectDb =async()=>{

    try{

      await  mongoose.connect(config.MONGO_URI);
      console.log("Database connected successfully");

    }
    catch(error){
        console.log(error);
        process.exit(1);
    }


}

export default connectDb;