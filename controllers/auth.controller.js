const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const authCtrl = {};

authCtrl.register = async (req, res) => {
    const { nombre, telefono, email, password } = req.body;

    try {
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                status: '0',
                msg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO Cliente (nombre, telefono, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [nombre.trim(), telefono.trim(), email.toLowerCase().trim(), hashedPassword]
        );

        const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        res.json({ status: '1', msg: 'Usuario registrado exitosamente', token });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ status: '0', msg: 'El email ya está registrado' });
        }
        console.error('[REGISTER ERROR]', error.message);
        res.status(400).json({ status: '0', msg: 'Error al registrar el usuario' });
    }
};

authCtrl.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM Cliente WHERE email = $1', [email.toLowerCase().trim()]);

        if (result.rows.length === 0) {
            console.warn(`[LOGIN FAIL] Email no registrado: ${email}`);
            return res.status(401).json({ status: '0', msg: 'Email o contraseña incorrectos' });
        }

        const user = result.rows[0];

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            console.warn(`[LOGIN FAIL] Contraseña incorrecta para: ${email}`);
            return res.status(401).json({ status: '0', msg: 'Email o contraseña incorrectos' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        res.json({ status: '1', msg: 'Login exitoso', token });
    } catch (error) {
        console.error('[LOGIN ERROR]', error.message);
        res.status(500).json({ status: '0', msg: 'Error en el servidor' });
    }
};

module.exports = authCtrl;