import express from 'express';
import { login, register, verifyAccount } from '../controllers/auth.js';
const router = express.Router();

router.post('/register', register);
router.get('/login', login);
router.put('/verifyAccount/:token', verifyAccount);

export default router;