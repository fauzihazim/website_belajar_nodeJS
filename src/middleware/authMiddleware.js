import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    };
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        } else if (!user.verificationAt) {
            return res.status(401).json({ message: "Please verification your account" });
        }
        req.user = user;
        next();
    });
};
export const isAdmin = (req, res, next) => {
    const user = req.user;
    const isAdmin = user.isAdmin;
    console.log(isAdmin);
    
    if (isAdmin === 0) {
        return res.status(401).send({Status: "failed", message: "is not admin"});
    }
    next();
};

// For validate the req.body
export const validateRegister = [
    body('username').notEmpty().escape().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).escape().withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().escape().withMessage('Invalid email address'),
    body('fullName').notEmpty().escape().withMessage('Full name is required'),
];