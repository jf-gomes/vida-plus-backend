import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'; 

const router = Router();

//abaixo estão as rotas da entidade Appointment
//cada rota chama uma função do controller
//algumas funções necessitam do authorize para serem chamadas
router.post(
    '/', 
    authenticate,
    authorize(['HealthProfessional', 'Admin']), 
    appointmentController.create
);

router.get(
    '/', 
    authenticate,
    appointmentController.getAll
);

router.delete(
    '/:id', 
    authenticate,
    appointmentController.remove
);

export default router;