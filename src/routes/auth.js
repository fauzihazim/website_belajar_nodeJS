import express from 'express';
import { login, register, verifyAccount } from '../controllers/auth.js';
import { param } from 'express-validator';
import { validateLogin, validateRegister } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', validateRegister, register);
router.get('/login', validateLogin, login);
router.put('/verifyAccount/:token', param('token').isString().withMessage('Invalid Token').notEmpty().trim().escape().withMessage('Token is required'), verifyAccount);

export default router;