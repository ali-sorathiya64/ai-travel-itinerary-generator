import jwt from "jsonwebtoken";
import config from "../config/config.js";

const auth = (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

        req.user = decoded;   

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export default auth;