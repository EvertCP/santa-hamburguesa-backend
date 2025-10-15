import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Verificar que la API key esté configurada
if (!process.env.RESEND_API_KEY) {
  console.error('❌ Error: RESEND_API_KEY no está configurada');
} else {
  console.log('✅ Resend configurado correctamente');
}

// Función para enviar email de calificación baja
export const sendLowRatingEmail = async (ratingData) => {
  const { name, email, rating, comments } = ratingData;

  const emailData = {
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev', // Usa tu dominio verificado en Resend
    to: process.env.EMAIL_TO,
    subject: `⚠️ Nueva Calificación Baja - ${rating} estrella${rating !== 1 ? 's' : ''}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #ff6b35;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
          }
          .rating {
            font-size: 24px;
            color: #ff6b35;
            margin: 10px 0;
          }
          .info-row {
            margin: 15px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-left: 4px solid #ff6b35;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .comments-box {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #777;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍔 Nueva Calificación Recibida</h1>
          </div>
          <div class="content">
            <p>Se ha recibido una nueva calificación que requiere atención:</p>
            
            <div class="rating">
              <strong>Calificación:</strong> ${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)
            </div>

            <div class="info-row">
              <span class="label">Nombre del cliente:</span><br>
              ${name}
            </div>

            <div class="info-row">
              <span class="label">Correo electrónico:</span><br>
              <a href="mailto:${email}">${email}</a>
            </div>

            <div class="comments-box">
              <span class="label">Comentarios del cliente:</span><br><br>
              ${comments}
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <strong>Recomendación:</strong> Te sugerimos contactar al cliente para resolver cualquier inconveniente y mejorar su experiencia.
            </p>
          </div>
          <div class="footer">
            <p>Este correo fue generado automáticamente por el sistema de calificaciones de Santa Hamburguesa.</p>
            <p>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    // Versión texto plano como alternativa
    text: `
      Nueva Calificación Baja Recibida
      
      Calificación: ${rating}/5 estrellas
      Nombre: ${name}
      Email: ${email}
      
      Comentarios:
      ${comments}
      
      Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
    `,
  };

  try {
    const { data, error } = await resend.emails.send(emailData);
    
    if (error) {
      console.error('❌ Error al enviar email:', error);
      throw error;
    }
    
    console.log('✅ Email enviado:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};