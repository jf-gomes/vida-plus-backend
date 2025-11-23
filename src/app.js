import express from 'express';
import cors from 'cors';
import { NODE_ENV } from './config/env.js';

import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js'
import roomRoutes from './routes/room.routes.js'
import supplyRoutes from './routes/supply.routes.js'
import prescriptionRoutes from './routes/prescription.routes.js'

import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// Permite requisições de qualquer origem durante o desenvolvimento
// Em produção, restringir ao domínio do frontend.
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bem-vindo ao VidaPlus Hospital Management API!',
        environment: NODE_ENV,
        status: 'online'
    });
});

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/supplies', supplyRoutes)
app.use('/api/prescriptions', prescriptionRoutes)

app.use((req, res, next) => {
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});

app.use(errorMiddleware);

export default app;