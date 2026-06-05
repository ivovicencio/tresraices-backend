const express = require('express'); // Framework para construir la API
const cors = require('cors'); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const helmet = require('helmet'); // Middleware para mejorar la seguridad de la aplicación configurando cabeceras HTTP
const rateLimit = require('express-rate-limit'); // Middleware para limitar la cantidad de solicitudes que un cliente puede hacer en un período de tiempo determinado (protección contra ataques de denegación de servicio)
require('dotenv').config(); // Carga variables de entorno desde un archivo .env, lo que permite configurar la aplicación sin modificar el código fuente (por ejemplo, para establecer la URL de la base de datos o la clave secreta)

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { status: '0', msg: 'Demasiadas solicitudes, intente de nuevo en 15 minutos' }
});

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/propiedades', require('./routes/propiedad.route'));
app.use('/api/leads', require('./routes/lead.route'));

app.get('/', (req, res) => {
    res.json({ status: '1', msg: 'API Inmobiliaria Tres Raíces - Online' });
});

app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
