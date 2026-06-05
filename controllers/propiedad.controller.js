const pool = require('../db');
const propiedadCtrl = {};

propiedadCtrl.getPropiedades = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, precio_min, precio_max, estado, search } = req.query;

        const conditions = [];
        const params = [];
        let paramIndex = 1;

        if (precio_min) {
            conditions.push(`precio >= $${paramIndex++}`);
            params.push(parseFloat(precio_min));
        }
        if (precio_max) {
            conditions.push(`precio <= $${paramIndex++}`);
            params.push(parseFloat(precio_max));
        }
        if (estado) {
            conditions.push(`estado = $${paramIndex++}`);
            params.push(estado);
        }
        if (search) {
            conditions.push(`LOWER(titulo) LIKE LOWER($${paramIndex++})`);
            params.push(`%${search}%`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countResult = await pool.query(`SELECT COUNT(*) FROM Propiedad ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count);

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const query = `SELECT p.*, i.nombre as inmobiliaria_nombre
                       FROM Propiedad p
                       LEFT JOIN Inmobiliaria i ON p.inmobiliaria_id = i.id
                       ${whereClause}
                       ORDER BY p.id DESC
                       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        const result = await pool.query(query, [...params, limitNum, offset]);

        res.json({
            status: '1',
            msg: 'Propiedades obtenidas correctamente',
            data: {
                propiedades: result.rows,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
};

propiedadCtrl.getPropiedad = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT p.*, i.nombre as inmobiliaria_nombre, i.direccion as inmobiliaria_direccion
             FROM Propiedad p
             LEFT JOIN Inmobiliaria i ON p.inmobiliaria_id = i.id
             WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: '0', msg: 'Propiedad no encontrada' });
        }

        res.json({ status: '1', msg: 'Propiedad encontrada', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

propiedadCtrl.createPropiedad = async (req, res, next) => {
    try {
        const { titulo, precio, estado, inmobiliaria_id } = req.body;

        const result = await pool.query(
            `INSERT INTO Propiedad (titulo, precio, estado, inmobiliaria_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [titulo, precio, estado, inmobiliaria_id || null]
        );

        res.json({ status: '1', msg: 'Propiedad creada exitosamente', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

propiedadCtrl.updatePropiedad = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, precio, estado, inmobiliaria_id } = req.body;

        const existing = await pool.query('SELECT id FROM Propiedad WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ status: '0', msg: 'Propiedad no encontrada' });
        }

        const fields = [];
        const params = [];
        let paramIndex = 1;

        if (titulo !== undefined) { fields.push(`titulo = $${paramIndex++}`); params.push(titulo); }
        if (precio !== undefined) { fields.push(`precio = $${paramIndex++}`); params.push(precio); }
        if (estado !== undefined) { fields.push(`estado = $${paramIndex++}`); params.push(estado); }
        if (inmobiliaria_id !== undefined) { fields.push(`inmobiliaria_id = $${paramIndex++}`); params.push(inmobiliaria_id); }

        if (fields.length === 0) {
            return res.status(400).json({ status: '0', msg: 'No hay campos para actualizar' });
        }

        params.push(id);
        const result = await pool.query(
            `UPDATE Propiedad SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );

        res.json({ status: '1', msg: 'Propiedad actualizada', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

propiedadCtrl.deletePropiedad = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await pool.query('SELECT id FROM Propiedad WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ status: '0', msg: 'Propiedad no encontrada' });
        }

        const refs = await pool.query(
            'SELECT COUNT(*) FROM SolicitudVisita WHERE propiedad_id = $1',
            [id]
        );
        if (parseInt(refs.rows[0].count) > 0) {
            return res.status(409).json({
                status: '0',
                msg: `No se puede eliminar: ${refs.rows[0].count} solicitud(es) de visita referencian esta propiedad`
            });
        }

        await pool.query('DELETE FROM Propiedad WHERE id = $1', [id]);
        res.json({ status: '1', msg: 'Propiedad eliminada correctamente' });
    } catch (error) {
        next(error);
    }
};

module.exports = propiedadCtrl;
