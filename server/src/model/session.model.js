import mongoose, { Mongoose } from "mongoose";



const sessionSchema = new mongoose.Schema ({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"User is required"],
        trim:true
    },
    refreshTokenHash:{
        type:String,
        required:[true,"Refresh token hash is required"],
    },
     ip:{
        type:String,
        required:[true ,"Ip address is required"]
     },
     userAgent:{
        type:String,
        required:[true,"User agent is required"]
     },
     revoked:{
        type:Boolean,
        default:false
     }
} ,{
    timestamps:true
})

const sessionModel = mongoose.model("sessions",sessionSchema);
export default sessionModel;