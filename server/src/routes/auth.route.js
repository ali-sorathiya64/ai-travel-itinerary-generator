import express from "express";
import { getMe, logout, logoutAll, refreshToken, userLogin, userRegister, verifyEmail } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register",userRegister)
authRouter.post("/login",userLogin);
authRouter.get("/get-me",getMe)
authRouter.get("/refresh-token", refreshToken)
authRouter.post("/logout",logout)
authRouter.post("/logout-all",logoutAll);
authRouter.post("/verify-email",verifyEmail)


export default authRouter;
