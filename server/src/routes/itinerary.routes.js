import express from "express";

import upload from "../middleware/upload.middleware.js";

import auth from "../middleware/auth.middleware.js";
import {
    uploadBooking,
    getMyItineraries,
    getSharedItinerary,
    deleteItinerary
} from "../controller/itinerary.controller.js";


const irouter = express.Router();



irouter.post(
    "/upload",
    auth,
    upload.single("file"),
    uploadBooking
);

irouter.get("/my", auth, getMyItineraries);

irouter.delete(
 "/:id",
  auth,
 deleteItinerary
);

irouter.get("/share/:shareId", getSharedItinerary);

export default irouter;