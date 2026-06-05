const express = require('express');
const router = express.Router();
const propiedadCtrl = require('../controllers/propiedad.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator');

const propiedadSchema = {
    titulo: { required: true, type: 'string', minLength: 3 },
    precio: { required: true, type: 'number', min: 0 },
    estado: { required: true, enum: ['Disponible', 'Reservado', 'Vendido'] },
    inmobiliaria_id: { type: 'number', min: 1 },
    superficie: { type: 'number', min: 0 },
    ubicacion: { type: 'string' },
    manzana: { type: 'string' },
    lote_num: { type: 'string' }
};

router.get('/', propiedadCtrl.getPropiedades);
router.get('/:id', propiedadCtrl.getPropiedad);
router.post('/', verifyToken, validate(propiedadSchema), propiedadCtrl.createPropiedad);
router.put('/:id', verifyToken, propiedadCtrl.updatePropiedad);
router.delete('/:id', verifyToken, propiedadCtrl.deletePropiedad);

module.exports = router;
