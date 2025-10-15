import express from 'express';
import { sendLowRatingEmail } from '../config/email.js';

const router = express.Router();

// Endpoint para recibir calificaciones bajas
router.post('/submit-low-rating', async (req, res) => {
  try {
    const { name, email, rating, comments } = req.body;

    // Validaciones
    if (!name || !email || !rating || !comments) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
      });
    }

    if (rating < 1 || rating > 3) {
      return res.status(400).json({
        success: false,
        message: 'Este endpoint es solo para calificaciones de 1 a 3 estrellas',
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido',
      });
    }

    // Enviar email
    const result = await sendLowRatingEmail({ name, email, rating, comments });

    res.status(200).json({
      success: true,
      message: 'Calificación recibida y email enviado correctamente',
      data: {
        messageId: result.messageId,
      },
    });
  } catch (error) {
    console.error('Error en /submit-low-rating:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la calificación',
      error: error.message,
    });
  }
});

// Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API de calificaciones funcionando correctamente',
  });
});

export default router;