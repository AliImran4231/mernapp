const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get the token from the header
        token = req.headers.authorization.split(" ")[1];

        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Get the user from the database
        req.user = await User.findById(decoded.id).select("-password");
        
        next();
        } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
        }
    }
    
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    });
    
    module.exports = { protect };