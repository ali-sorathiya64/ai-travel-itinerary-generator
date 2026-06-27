import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../model/session.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../model/otp.model.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export const userRegister = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ userName }, { email }]
        });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                success: false,
                message: "User or email already exist"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            userName,
            email,
            password: hashPassword
        });

        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otpHash = await bcrypt.hash(otp, 10);

        await otpModel.create({ email, user: user._id, otpHash });

        await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                userName: user.userName,
                email: user.email,
                verified: user.verified
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email and password"
            });
        }

        if (!user.verified) {
            return res.status(401).json({
                success: false,
                message: "Email not verified"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email and password"
            });
        }

        const refreshToken = jwt.sign(
            { id: user._id },
            config.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        const accessToken = jwt.sign(
            { id: user._id, sessionId: session._id },
            config.JWT_SECRET_KEY,
            { expiresIn: "15m" }
        );

        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                username: user.userName,
                email: user.email
            },
            accessToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                userName: user.userName,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

        const sessions = await sessionModel.find({
            user: decoded.id,
            revoked: false
        });

        let currentSession = null;

        for (const session of sessions) {
            const isValid = await bcrypt.compare(token, session.refreshTokenHash);
            if (isValid) {
                currentSession = session;
                break;
            }
        }

        if (!currentSession) {
            return res.status(401).json({
                success: false,
                message: "Session expired or revoked"
            });
        }

        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            config.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

        currentSession.refreshTokenHash = newRefreshTokenHash;
        await currentSession.save();

        const accessToken = jwt.sign(
            { id: decoded.id, sessionId: currentSession._id },
            config.JWT_SECRET_KEY,
            { expiresIn: "15m" }
        );

        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            accessToken
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

        const sessions = await sessionModel.find({
            user: decoded.id,
            revoked: false
        });

        let currentSession = null;

        for (const session of sessions) {
            const isValid = await bcrypt.compare(token, session.refreshTokenHash);
            if (isValid) {
                currentSession = session;
                break;
            }
        }

        if (!currentSession) {
            return res.status(400).json({
                success: false,
                message: "Invalid session"
            });
        }

        currentSession.revoked = true;
        await currentSession.save();

        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "User logout successfully"
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export const logoutAll = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

        await sessionModel.updateMany(
            { user: decoded.id, revoked: false },
            { revoked: true }
        );

        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "User logout from all devices"
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP required"
            });
        }

        const otpDoc = await otpModel.findOne({
            email,
            createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) }
        });

        if (!otpDoc) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired"
            });
        }

        const isOtpValid = await bcrypt.compare(otp.toString(), otpDoc.otpHash);

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const user = await userModel.findByIdAndUpdate(
            otpDoc.user,
            { verified: true },
            { new: true }
        );

        await otpModel.deleteMany({ user: otpDoc.user });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                userName: user.userName,
                email: user.email,
                verified: user.verified
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};