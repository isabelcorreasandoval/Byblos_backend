const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require("cors");


connectDB();

const app = express();

// Middlewares 
app.use(cors()); // Para que el frontend pueda consultar al backend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Definición de rutas 
app.use('/api/libros', require('./routes/librosRoutes'));
app.use('/api/contactos', require('./routes/contactoRoutes'));

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`.yellow));