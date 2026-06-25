import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { extractPdfText } from "../services/pdf.service.js";
import { extractImageText } from "../services/ocr.service.js";
import { createItinerary } from "../services/itinerary.service.js";
import Itinerary from "../model/Itinerary.model.js";
import crypto from "crypto";
import { cleanText, isValidText } from "../services/textCleaner.service.js";



export const uploadBooking = async (req, res) => {

    try {


        if (!req.file) {

            return res.status(400).json({
                success:false,
                message:"File not found"
            });

        }



        const uploadResult = await uploadToCloudinary(req.file);



        let text = "";



        if (req.file.mimetype === "application/pdf") {


            text = await extractPdfText(
                uploadResult.secure_url
            );


        } else {


            text = await extractImageText(
                uploadResult.secure_url
            );


        }



        text = cleanText(text);




        if (!isValidText(text)) {


            return res.status(400).json({
                success:false,
                message:"Could not extract valid booking data"
            });


        }





        const parsedAI = await createItinerary(text);





        const saved = await Itinerary.create({


            user:req.user.id,


            title:
            parsedAI?.title ||
            "AI Trip",



            bookingData:text,



            itinerary:parsedAI,



            shareId:crypto.randomUUID()


        });






        return res.status(201).json({

            success:true,

            data:saved

        });





    } catch(error) {


        console.log(error);


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

};









export const getMyItineraries = async(req,res)=>{


    try{


        const data = await Itinerary.find({

            user:req.user.id

        })
        .sort({

            createdAt:-1

        });




        return res.status(200).json({

            success:true,

            data

        });



    }catch(error){



        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};









export const getSharedItinerary = async(req,res)=>{


    try{


        const {shareId} = req.params;




        const data = await Itinerary.findOne({

            shareId

        });





        if(!data){


            return res.status(404).json({

                success:false,

                message:"Itinerary not found"

            });


        }





        return res.status(200).json({

            success:true,

            data

        });





    }catch(error){



        return res.status(500).json({

            success:false,

            message:error.message

        });


    }


};
export const deleteItinerary = async(req,res)=>{

    try{


        const {id} = req.params;



        const deleted = await Itinerary.findOneAndDelete({

            _id:id,

            user:req.user.id

        });



        if(!deleted){

            return res.status(404).json({

                success:false,

                message:"Itinerary not found"

            });

        }




        return res.status(200).json({

            success:true,

            message:"Itinerary deleted successfully"

        });



    }catch(error){


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

};