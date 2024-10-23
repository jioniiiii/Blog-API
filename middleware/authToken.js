const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //extract token from "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    //console.log("Token received:", token);  

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err); 
            return res.status(403).json({ message: 'Token is invalid' });
        }

        try {
            const userId = decoded.userId;
            const user = await User.findById(userId);//find user by id 

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user; //attach user object to request
            next(); //pass control to the next handler
        } catch (error) {
            console.error("Error finding user:", error);
            return res.status(500).json({ message: 'Failed to authenticate user' });
        }
    });
};

module.exports = authenticateToken;