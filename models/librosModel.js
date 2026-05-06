const mongoose = require('mongoose');

const libroSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: [true, "Por favor teclea el título del libro"]
    },
    autor: {
        type: String,
        required: [true, "Por favor teclea el autor"]
    },
    descripcion: {
        type: String,
        required: [true, "Por favor teclea una breve descripción del libro"]
    },
    isbn: {
        type: String,
        required: false 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Libro', libroSchema);