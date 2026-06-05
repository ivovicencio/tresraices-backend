const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authCtrl = {};

// REGISTRO DE USUARIO
authCtrl.register = async (req, res) => {
    const { nombre, telefono, email, password } = req.body; // Recibimos los datos del usuario desde el cuerpo de la solicitud

    try {
        // 1. Encriptar la contraseña (hashing)
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Guardar en PostgreSQL
        const result = await pool.query(
            'INSERT INTO Cliente (nombre, telefono, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [nombre, telefono, email, hashedPassword]
        );

        // 3. Generar Token // El token se genera con el ID del usuario recién creado y una clave secreta definida en las variables de entorno, con una expiración de 24 horas.
        const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 horas
        });

        res.json({ status: '1', msg: 'Usuario registrado exitosamente', token });
    } catch (error) {
        res.status(400).json({ status: '0', msg: 'Error al registrar el usuario.', error: error.message });
    }
};

// LOGIN DE USUARIO
authCtrl.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar el usuario por email
        const result = await pool.query('SELECT * FROM Cliente WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ status: '0', msg: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        // 2. Comparar contraseñas
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ status: '0', msg: 'Contraseña incorrecta', token: null });
        }

        // 3. Generar Token si todo está OK
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 horas
        });

        res.json({ status: '1', msg: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ status: '0', msg: 'Error en el servidor', error: error.message });
    }
};

module.exports = authCtrl;