const { executeQuery, pool } = require('../db');
const bcrypt = require('bcryptjs');
const leadCtrl = {};

leadCtrl.createLead = async (req, res, next) => {
    try {
        const { nombre, telefono, email, propiedad_id } = req.body;

        let clientResult = await pool.query('SELECT id, nombre FROM Cliente WHERE email = $1', [email]);
        let cliente_id;

        if (clientResult.rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const tempPassword = await bcrypt.hash(Date.now().toString(), salt);
            const generatedUsername = email.split('@')[0] + '_' + Date.now().toString(36);
            const newClient = await pool.query(
                'INSERT INTO Cliente (username, nombre, apellido, telefono, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [generatedUsername, nombre, '', telefono, email, tempPassword]
            );
            cliente_id = newClient.rows[0].id;
        } else {
            cliente_id = clientResult.rows[0].id;
            await pool.query(
                'UPDATE Cliente SET nombre = $1, telefono = $2 WHERE id = $3',
                [nombre, telefono, cliente_id]
            );
        }

        const propCheck = await pool.query('SELECT id, titulo FROM Propiedad WHERE id = $1', [propiedad_id]);
        if (propCheck.rows.length === 0) {
            return res.status(404).json({ status: '0', msg: 'La propiedad especificada no existe' });
        }

        const result = await pool.query(
            `INSERT INTO SolicitudVisita (cliente_id, propiedad_id, estado)
             VALUES ($1, $2, $3) RETURNING id`,
            [cliente_id, propiedad_id, 'Pendiente']
        );

        res.json({
            status: '1',
            msg: 'Solicitud de visita creada exitosamente. Nos pondremos en contacto pronto.',
            data: { id: result.rows[0].id }
        });
    } catch (error) {
        next(error);
    }
};

leadCtrl.getLeads = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, estado } = req.query;

        const conditions = [];
        const params = [];
        let paramIndex = 1;

        if (estado) {
            conditions.push(`sv.estado = $${paramIndex++}`);
            params.push(estado);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countResult = await executeQuery(
            `SELECT COUNT(*) FROM SolicitudVisita sv ${whereClause}`, params,
            { role: req.role, userId: req.userId }
        );
        const total = parseInt(countResult.rows[0].count);

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        const query = `
            SELECT sv.id, sv.fecha, sv.estado,
                   c.id as cliente_id, c.nombre as cliente_nombre,
                   c.telefono as cliente_telefono, c.email as cliente_email,
                   p.id as propiedad_id, p.titulo as propiedad_titulo,
                   p.precio as propiedad_precio
            FROM SolicitudVisita sv
            JOIN Cliente c ON sv.cliente_id = c.id
            JOIN Propiedad p ON sv.propiedad_id = p.id
            ${whereClause}
            ORDER BY sv.id DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        const result = await executeQuery(query, [...params, limitNum, offset],
            { role: req.role, userId: req.userId }
        );

        res.json({
            status: '1',
            msg: 'Solicitudes obtenidas correctamente',
            data: {
                leads: result.rows,
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

leadCtrl.updateLeadStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const existing = await executeQuery(
            'SELECT id FROM SolicitudVisita WHERE id = $1', [id],
            { role: req.role, userId: req.userId }
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ status: '0', msg: 'Solicitud de visita no encontrada' });
        }

        const result = await executeQuery(
            'UPDATE SolicitudVisita SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id],
            { role: req.role, userId: req.userId }
        );

        res.json({ status: '1', msg: 'Estado actualizado correctamente', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = leadCtrl;
