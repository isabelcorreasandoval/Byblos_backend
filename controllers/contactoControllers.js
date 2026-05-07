const Contacto = require('../models/ContactoModel');

// obtener todos los mensajes (READ)
const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await Contacto.find();
        res.status(200).json(mensajes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE. Crear un mensaje y enviar notificación 
const crearMensaje = async (req, res) => {
    try {
        const nuevoMensaje = await Contacto.create(req.body);

        // Configuración del correo para la API de Brevo
        const emailData = {
            sender: { name: "Byblos Notificaciones", email: process.env.BREVO_USER },
            to: [{ email: process.env.EMAIL_USER, name: "Isabel" }],
            subject: `Nuevo comentario de: ${req.body.nombre}`,
            htmlContent: `
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
                            Notificacion automatica del sistema Byblos.
                        </p>
                    </div>
                </div>
            `
        };

        // Envío del correo vía API HTTP (Esto evita el bloqueo de puertos en Render)
        fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Notificacion enviada con exito');
        })
        .catch(error => {
            console.log('Error de envio:', error.message);
        });

        res.status(201).json(nuevoMensaje);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// actualizar un mensaje (UPDATE)
const actualizarMensaje = async (req, res) => {
    try {
        const mensajeActualizado = await Contacto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mensajeActualizado) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }
        res.status(200).json({
            message: 'Contacto actualizado correctamente',
            data: mensajeActualizado
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// eliminar un mensaje (DELETE)
const eliminarMensaje = async (req, res) => {
    try {
        const mensaje = await Contacto.findByIdAndDelete(req.params.id);
        if (!mensaje) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }
        res.status(200).json({ 
            message: 'Contacto eliminado correctamente', 
            id: req.params.id 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { obtenerMensajes, crearMensaje, actualizarMensaje, eliminarMensaje };