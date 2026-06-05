const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

require('./db/cache');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { status: '0', msg: 'Demasiadas solicitudes, intente de nuevo en 15 minutos' }
});

app.use(compression());
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
