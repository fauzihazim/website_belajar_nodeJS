import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    };
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ status: "failed", message: "Invalid Credentials"});
        } else if (!user.verificationAt) {
            return res.status(403).json({ status: "failed", message: "Please verification your account" });
        }
        req.user = user;
        next();
    });
};
export const isAdmin = (req, res, next) => {
    const user = req.user;
    const isAdmin = user.isAdmin;
    if (isAdmin === 0) {
        return res.status(403).send({Status: "failed", message: "is not admin"});
    }
    next();
};

export const validateRegister = [
    body('username')
        .isString().withMessage('Invalid Username')
        .notEmpty()
        .escape()
        .withMessage('Username is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isString()
        .escape()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email')
        .notEmpty()
        .isEmail()
        .escape().withMessage('Invalid email address'),
    body('fullName')
        .notEmpty()
        .isString()
        .escape().withMessage('Full name is required'),
];

export const validateLogin = [
    body('username')
        .isString().withMessage('Invalid Username')
        .notEmpty()
        .withMessage('Invalid Username')
        .escape()
        .withMessage('Username is required'),
    body('password')
        .notEmpty().withMessage('Username is required')
        .isString()
        .withMessage('Invalid Password')
        .escape()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]