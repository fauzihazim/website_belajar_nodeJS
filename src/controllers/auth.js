import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db.js';
import { sendEmail } from './mailer.js';

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '150m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

// In-memory store for refresh tokens (use a database or redis for production)
// let refreshTokens = [];

export const register = async (req, res) => {
    const { username, password, email, fullName } = req.body;
    console.log("Username: ", username, "password: ", password, "email: ", email, "fullName: ", fullName);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = moment();
    const token = generateVerificationToken();
    console.log("Verification token is ", token);
    try {
        await pool.query(`insert into users (username, password, email, fullName, registerAt, verificationToken) values (?, ?, ?, ?, ?, ?)`, [username, hashedPassword, email, fullName, now.format('YYYY-MM-DD HH:mm:ss'), token]);
        sendEmail(req, res, email, token);
        res.status(201).json({ message: `User ${username} registered successfully`});
    } catch(error) {
        res.status(500).json({ message: "Error registering user", errorMessage: error.message });
    }
};

const generateVerificationToken = () => {
    return uuidv4();
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await pool.query("select * from users where username = ?", [username]);
        const user = results[0];
        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken({ username: user.username, email: user.email, isAdmin: user.is_admin, verificationAt: user.verificationAt });
            const refreshToken = generateRefreshToken({ username: user.username, email: user.email, isAdmin: user.is_admin, verificationAt: user.verificationAt });
            // const accessToken = generateAccessToken({ username: user.username, email: user.email, isAdmin: user.is_admin });
            // const refreshToken = generateRefreshToken({ username: user.username, email: user.email, isAdmin: user.is_admin });
            res.status(200).json({ accessToken, refreshToken });
        } else {
            res.status(401).json({ message: "Invalid credential" });
        }
    } catch (error) {
        res.status(500).json({ message: "Login error" });
    }
}

export const verifyAccount = async (req, res) => {
    const token = req.query.token;
    // const token = req.body.token;
    console.log("The token is ", token);
    
    const now = moment();
    try {
        const [result] = await pool.execute("UPDATE users SET verificationAt = ? WHERE verificationToken = ?", [now.format('YYYY-MM-DD HH:mm:ss'), token]);
        result.affectedRows ? res.status(201).json({ message: "Success to verify", result: result.affectedRows }) : res.status(404).json({ message: "Invalid Verification Token" });
    } catch (error) {
        res.status(400).json({ message: "Failed to verify" })
    }
}