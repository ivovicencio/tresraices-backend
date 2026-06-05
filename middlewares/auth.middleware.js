const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Obtenemos el token del header de la petición (del frontend de Angular)
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ status: '0', msg: 'No se proveyó un token.' });
    }

    try {
        // Si el token viene como "Bearer <token>", lo limpiamos
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.userId = decoded.id; // Guardamos el ID del usuario para usarlo después
        next(); // Lo dejamos pasar a la ruta
    } catch (error) {
        return res.status(401).json({ status: '0', msg: 'Token no válido o expirado.' });
    }
};

module.exports = { verifyToken };