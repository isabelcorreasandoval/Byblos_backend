const express = require('express');
const router = express.Router();
const { obtenerMensajes, crearMensaje, actualizarMensaje, eliminarMensaje } = require('../controllers/contactoControllers');

router.route('/').get(obtenerMensajes).post(crearMensaje);
router.route('/:id').put(actualizarMensaje).delete(eliminarMensaje);

module.exports = router;