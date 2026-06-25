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

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/itinerary", irouter);

app.listen(PORT, ()=> console.log(`Server started on ${PORT}`));