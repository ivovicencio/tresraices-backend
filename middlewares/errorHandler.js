const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.stack || err.message}`);

    if (err.code === '23505') {
        return res.status(409).json({ status: '0', msg: 'El registro ya existe (valor duplicado)' });
    }
    if (err.code === '23503') {
        return res.status(400).json({ status: '0', msg: 'Violación de clave foránea: el registro referenciado no existe' });
    }
    if (err.code === '22P02') {
        return res.status(400).json({ status: '0', msg: 'Tipo de dato inválido en la consulta' });
    }

    const status = err.status || 500;
    const message = status === 500 ? 'Error interno del servidor' : err.message;

    res.status(status).json({ status: '0', msg: message });
};

module.exports = errorHandler;
