import express from 'express';
import { login, register, verifyAccount } from '../controllers/auth.js';
import { param } from 'express-validator';
import { validateRegister } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', validateRegister, register);
router.get('/login', login);
router.put('/verifyAccount/:token', param('token').isString().notEmpty().trim().escape().withMessage('Token is required'), verifyAccount);

export default router;