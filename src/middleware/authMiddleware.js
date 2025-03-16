import jwt from 'jsonwebtoken';
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