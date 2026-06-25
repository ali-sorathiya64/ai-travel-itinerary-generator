import mongoose from "mongoose";


const otpSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,"User is required"]
    },
    otpHash:{
        type:String,
        required:[true,"Otp is required"]
    }
}, {
    timestamps:true
})


const otpModel = mongoose.model("otps",otpSchema);
export default otpModel;