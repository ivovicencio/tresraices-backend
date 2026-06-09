const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const pool = require('./db');
const cache = require('./db/cache');

// ── Validación de variables de entorno al arranque ──
const REQUIRED_ENV = ['JWT_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`Falta variable de entorno: ${key}`);
        process.exit(1);
    }
}

const app = express();

// ── Rate limiters ──
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { status: '0', msg: 'Demasiadas solicitudes, intente de nuevo en 15 minutos' }
});

// ── Security headers ──
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'none'"],
            styleSrc: ["'none'"],
            imgSrc: ["'none'"],
            connectSrc: ["'self'"],
            fontSrc: ["'none'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'none'"],
            formAction: ["'none'"],
        },
    },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'no-referrer' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// ── CORS ──
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : ['http://localhost:4200'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Body parsing con límite ──
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Rate limit global ──
app.use('/api/', globalLimiter);

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/propiedades', require('./routes/propiedad.route'));
app.use('/api/leads', require('./routes/lead.route'));

app.get('/', (req, res) => {
    res.json({ status: '1', msg: 'API Inmobiliaria Tres Raíces - Online' });
});

app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 3000;

// ── Graceful shutdown ──
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

const gracefulShutdown = async (signal) => {
    console.log(`\n[${signal}] Cerrando servidor gracefully...`);
    server.close(async () => {
        try {
            await pool.end();
            console.log('Conexiones a PostgreSQL cerradas');
        } catch (err) {
            console.error('Error cerrando PostgreSQL:', err.message);
        }
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Shutdown forzado por timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
