const Contacto = require('../models/ContactoModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// obtener todos los mensajes (READ)
const obtenerMensajes = async (req, res) => {
    const mensajes = await Contacto.find();
    res.status(200).json(mensajes);
};

// CREATE. Crear un mensaje y enviar notificación 
const crearMensaje = async (req, res) => {
    try {
        const nuevoMensaje = await Contacto.create(req.body);

        // Configuración del correo con diseño
        const mailOptions = {
            from: `"Byblos Notificaciones" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, 
            subject: `Nuevo comentario de: ${req.body.nombre}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #d4c3a3; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #4a3728; color: #ffffff; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Byblos - Mensaje Recibido</h1>
                    </div>
                    <div style="padding: 20px; background-color: #faf7f2; color: #4a3728;">
                        <p>Hola <strong>Isabel</strong>, has recibido un nuevo mensaje desde el formulario de contacto:</p>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #4a3728; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Nombre:</strong> ${req.body.nombre}</p>
                            <p style="margin: 5px 0;"><strong>Correo:</strong> ${req.body.email}</p>
                            <p style="margin: 5px 0;"><strong>Mensaje:</strong> ${req.body.mensaje}</p>
                        </div>
                        <p style="font-size: 12px; color: #888; text-align: center;">
                            Notificación automática del sistema Byblos.
                        </p>
                    </div>
                </div>
            `
        };

        // Envío del correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error de envío:', error);
            } else {
                console.log('Notificación enviada con éxito');
            }
        });


        res.status(201).json(nuevoMensaje);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// actualizar un mensaje (UPDATE)
const actualizarMensaje = async (req, res) => {
    const mensaje = await Contacto.findById(req.params.id);
    if (!mensaje) {
        res.status(404);
        throw new Error('Mensaje no encontrado');
    }
    const mensajeActualizado = await Contacto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        message: 'Contacto actualizado correctamente',
        data: mensajeActualizado
    });
};

// eliminar un mensaje (DELETE)
const eliminarMensaje = async (req, res) => {
    const mensaje = await Contacto.findById(req.params.id);
    if (!mensaje) {
        res.status(404);
        throw new Error('Mensaje no encontrado');
    }
    await mensaje.deleteOne();
    res.status(200).json({ 
        message: 'Contacto eliminado correctamente', 
        id: req.params.id 
    });
};

module.exports = { obtenerMensajes, crearMensaje, actualizarMensaje, eliminarMensaje };