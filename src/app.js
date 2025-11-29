import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { NODE_ENV } from './config/env.js';

//importação das rotas
import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js'
import roomRoutes from './routes/room.routes.js'
import supplyRoutes from './routes/supply.routes.js'
import prescriptionRoutes from './routes/prescription.routes.js'

import errorMiddleware from './middleware/error.middleware.js';

const app = express();

//configurações do cors
//aqui está configurado para permitir apenas as requisições oriundas do frontend (porta 5173)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, //necessário para os cookies funcionarem
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); //inicia o express para manipulação da api

app.use(cookieParser()); //inicia o cookieParser para permitir envio de tokens seguros

app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.originalUrl}`);
    //console.log('Cookies recebidos: ', req.cookies)
    //a linha acima permite visualizar os cookies pelo console
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bem-vindo ao VidaPlus Hospital Management API!',
        environment: NODE_ENV,
        status: 'online'
    });
});

//rotas da api
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