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

router.get(
    '/:id', 
    authenticate, 
    appointmentController.getById
    //aqui não é utilizado authorize, pois a verificação ocorre no appointment.controller.js
    //paciente vê todas as consultas atribuídas a ele
    //médico vê todas as consultas geradas por ele
    //administrador vê todas as consultas
);

router.put(
    '/:id', 
    authenticate, 
    authorize(['HealthProfessional', 'Admin']), //apenas profissionais da saúde e administradores podem editar consultas
    appointmentController.update
    //médico edita todas as consultas geradas por ele
    //administrador edita todas as consultas
);

router.delete(
    '/:id', 
    authenticate,
    appointmentController.remove
    //aqui não é utilizado authorize, pois a verificação ocorre no appointment.controller.js
    //paciente deleta todas as consultas atribuídas a ele
    //médico deleta todas as consultas geradas por ele
    //administrador deleta todas as consultas
);

export default router;