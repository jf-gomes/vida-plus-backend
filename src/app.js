import express from 'express';
import { NODE_ENV } from './config/env.js';

// Rotas
import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js'
import roomRoutes from './routes/room.routes.js'

import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware simples de log
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.originalUrl}`);
    next();
});

// --- Rotas da API ---

// Rota de saúde/status
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bem-vindo ao VidaPlus Hospital Management API!',
        environment: NODE_ENV,
        status: 'online'
    });
});

// Rotas específicas de entidade
// Para autenticação, o ideal seria app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes)
app.use('/api/rooms', roomRoutes)
// Adicionar as demais rotas aqui: app.use('/api/patients', patientRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

// Middleware de tratamento de erro centralizado (DEVE ser o último)
app.use(errorMiddleware);


export default app;