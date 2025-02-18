import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
export const authRequired = (req, res, next) => {
    const {token} = req.cookies;
    
    if (!token) return res.status(400).json({ message: 'No autorizado' });

    jwt.verify(token, dotenv.config().parsed.JWT_SECRET, (error, decoded) => {
        if (error) return res.status(401).json({ message: 'No autorizado' });
        req.user = decoded;
        next();
    });

    
}