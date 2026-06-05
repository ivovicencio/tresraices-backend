const express = require('express');
const router = express.Router();
const leadCtrl = require('../controllers/lead.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator');

const leadSchema = {
    nombre: { required: true, type: 'string', minLength: 2 },
    telefono: { required: true, type: 'string', minLength: 7 },
    email: { required: true, type: 'email' },
    propiedad_id: { required: true, type: 'number', min: 1 }
};

const statusSchema = {
    estado: { required: true, enum: ['Pendiente', 'Contactado', 'Cerrado'] }
};

router.post('/', validate(leadSchema), leadCtrl.createLead);
router.get('/', verifyToken, leadCtrl.getLeads);
router.put('/:id', verifyToken, validate(statusSchema), leadCtrl.updateLeadStatus);

module.exports = router;
