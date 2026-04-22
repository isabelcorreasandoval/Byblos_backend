const express = require('express');
const router = express.Router();

// se importan las funciones del controlador
const { 
    getLibros, 
    addLibro, 
    updateLibro, 
    deleteLibro 
} = require('../controllers/librosControllers');

//Middleware de seguridad
const { adminAuth } = require('../middleware/authMiddleware');


router.route('/')
    .get(getLibros) // público: cualquiera puede ver y buscar por texto
    .post(adminAuth, addLibro); // Protegido

router.route('/:id')
    .put(adminAuth, updateLibro) // Protegido
    .delete(adminAuth, deleteLibro); // Protegido

module.exports = router;
