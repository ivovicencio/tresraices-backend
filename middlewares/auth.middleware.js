const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ status: '0', msg: 'No se proveyó un token.' });
    }

    try {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.role = 'admin'; // Rol para RLS
        next();
    } catch (error) {
        return res.status(401).json({ status: '0', msg: 'Token no válido o expirado.' });
    }
};

module.exports = { verifyToken };