import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ratingRoutes from './routes/rating.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/rating', ratingRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Santa Hamburguesa - Sistema de Calificaciones',
    version: '1.0.0',
    endpoints: {
      test: '/api/rating/test',
      submitLowRating: '/api/rating/submit-low-rating',
    },
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
    🚀 Servidor backend iniciado
    📍 Puerto: ${PORT}
    🌐 URL: http://localhost:${PORT}
    🔧 Modo: ${process.env.NODE_ENV || 'development'}
  `);
});