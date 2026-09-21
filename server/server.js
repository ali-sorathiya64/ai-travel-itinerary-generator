import express from "express"
import dotenv from "dotenv";
import connectDb from "./src/Db/ConnectDb.js";
import config from "./src/config/config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.route.js";
import irouter from "./src/routes/itinerary.routes.js"
import cors from "cors"

dotenv.config();

const app = express();
const PORT = config.PORT;

connectDb();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000", "https://ai-travel-itinerary-generator-project.onrender.com",
 "https://travel-itinerary-generator-ai.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/itinerary", irouter);

app.listen(PORT, ()=> console.log(`Server started on ${PORT}`));