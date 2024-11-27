import express from 'express';
import { login, register, verifyAccount } from '../controllers/auth.js';
const router = express.Router();

router.post('/register', register);
router.get('/login', login);
router.post('/verify', verifyAccount);

export default router;