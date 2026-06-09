const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validator');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { status: '0', msg: 'Demasiados intentos de inicio de sesión, intente de nuevo en 15 minutos' }
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { status: '0', msg: 'Demasiados intentos de registro, intente de nuevo en 1 hora' }
});

const registerSchema = {
    username: { required: true, type: 'string', minLength: 3 },
    nombre: { required: true, type: 'string', minLength: 2 },
    apellido: { required: true, type: 'string', minLength: 2 },
    telefono: { required: true, type: 'string', minLength: 7 },
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 8 }
};

const loginSchema = {
    email: { required: true, type: 'string' },
    password: { required: true, type: 'string' }
};

router.post('/register', registerLimiter, validate(registerSchema), authCtrl.register);
router.post('/login', loginLimiter, validate(loginSchema), authCtrl.login);

module.exports = router;