const asyncHandler = require("express-async-handler");
const Libro = require("../models/librosModel");

// READ. Obtener todos los libros O filtrar por título
const getLibros = asyncHandler(async (req, res) => {
    const { titulo } = req.query; // Atrapamos el texto del buscador si existe
    
    let libros;

    if (titulo) {

        libros = await Libro.find({ 
            titulo: { $regex: titulo, $options: "i" } 
        });
    } else {
        // Si no hay búsqueda, mostramos todo el catálogo
        libros = await Libro.find({});
    }

    res.status(200).json(libros);
});

// CREATE. Agregar un libro
const addLibro = asyncHandler(async (req, res) => {
    if (!req.body.titulo) {
        res.status(400);
        throw new Error("Por favor teclea el título del libro");
    }

    const libro = await Libro.create({
        titulo: req.body.titulo,
        autor: req.body.autor,
        descripcion: req.body.descripcion
    });

    res.status(201).json(libro);
});

// UPDATE. Actualizar un libro
const updateLibro = asyncHandler(async (req, res) => {
    const libro = await Libro.findById(req.params.id);

    if (!libro) {
        res.status(404);
        throw new Error("Libro no encontrado para actualizar");
    }

    const libroActualizado = await Libro.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true } 
    );

    res.status(200).json(libroActualizado);
});

// DELETE. Borrar un libro
const deleteLibro = asyncHandler(async (req, res) => {
    const libro = await Libro.findById(req.params.id);

    if (!libro) {
        res.status(404);
        throw new Error("Libro no encontrado");
    } else {
        await Libro.deleteOne({ _id: req.params.id });
        res.status(200).json({ id: req.params.id, mensaje: "Libro eliminado correctamente" });
    }
});

module.exports = {
    getLibros, 
    addLibro, 
    updateLibro, 
    deleteLibro
};