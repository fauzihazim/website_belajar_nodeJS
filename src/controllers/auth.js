import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { validationResult } from 'express-validator';
import { sendEmail } from './mailer.js';

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '150m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

export const register = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: "Failed",
            message: error.array()[0].msg 
        });
    }
    const { username, password, email, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = moment();
    const token = generateVerificationToken();
    try {
        await pool.query(`insert into users (username, password, email, fullName, registerAt, verificationToken) values (?, ?, ?, ?, ?, ?)`, [username, hashedPassword, email, fullName, now.format('YYYY-MM-DD HH:mm:ss'), token]);
        sendEmail(email, token).catch(err => {
            console.error("Failed to send verification email:", err);
        });;
        res.status(201).json({ 
            status: "Success",
            message: `User ${username} registered successfully, please check your email to verify account`
        })
    } catch(error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "Failed",
                message: "Username or email already exists"
            });
        }
        console.error("Error during registration:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal Server Error"
        });
    }
}

const generateVerificationToken = () => {
    return uuidv4();
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await pool.query("select * from users where username = ?", [username]);
        const user = results[0];
        if (!user.verificationAt) {
            throw new Error("Your account isn't verified yet !");
        }
        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken({ username: user.username, email: user.email, isAdmin: user.is_admin, verificationAt: user.verificationAt });
            const refreshToken = generateRefreshToken({ username: user.username, email: user.email, isAdmin: user.is_admin, verificationAt: user.verificationAt });
            res.status(200).json({ accessToken, refreshToken });
        } else {
            res.status(401).json({ message: "Invalid credential" });
        }
    } catch (error) {
        console.log("Login error, ", error);
        res.status(500).json({ message: "Login error", errorMessage: error.message });
    }
}

export const verifyAccount = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        return res.status(400).json({
            status: "Failed",
            message: results.array()[0].msg
        });
    }
    const now = moment();
    try {
        const [result] = await pool.execute("UPDATE users SET verificationAt = ? WHERE verificationToken = ?", [now.format('YYYY-MM-DD HH:mm:ss'), req.params.token]);
        result.affectedRows
        ? res.status(200).json({
            status: "Success",
            message: "Your account has been verified successfully"
        })
        : res.status(404).json({
            status: "Failed",
            message: "Invalid Verification Token"
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Internal Server Error"
        });
    }
}