import dotenv from "dotenv"

    dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("Mongo URI is not defined");
}
if (!process.env.JWT_SECRET_KEY){
    throw new Error("JWT Secret is not defined in the environment variable")
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("Google client id is not defined in the environment variable")
}
if(!process.env.GOOGLE_CLIENT_SECRET){  
    throw new Error("Google client secret is not defined in the environment variable")
}
if(!process.env.GOOGLE_REFRESH_TOKEN){ 
    throw new Error("Google refresh token is not defined in the environment variable")  
}
if(!process.env.GOOGLE_USER){
    throw new Error("Google user is not defined in the environment variable")
}

const config ={
    PORT :process.env.PORT,
    MONGO_URI :process.env.MONGO_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER

}


export default config;