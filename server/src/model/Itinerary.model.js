import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,

    },
    title:{
        type:String
    },
    bookingData:{
        type:Object
    },
    itinerary:{
        type:Object
    },
    shareId:{
        type:String,
        unique:true
    }
},{
    timestamps:true
})


export default mongoose.model("Itinerary",itinerarySchema)