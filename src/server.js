import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ratingRoutes from './routes/rating.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'https://santahamburguesa.com',
  'https://www.santahamburguesa.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (como Postman, apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
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