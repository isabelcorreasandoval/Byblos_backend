const mongoose = require('mongoose');

const contactoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor teclea tu nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor teclea tu correo'],
        match: [/.+\@.+\..+/, 'Por favor teclea un correo válido']
    },
    mensaje: {
        type: String,
        required: [true, 'Por favor escribe tu mensaje']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contacto', contactoSchema);