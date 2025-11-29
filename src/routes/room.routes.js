import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = Router();

//abaixo estão as rotas da entidade Room
//cada rota chama uma função do controller
//algumas funções necessitam do authorize para serem chamadas
router.post(
    '/create',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem criar quartos
    roomController.create
);

router.get(
    '/',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem ver todos os quartos
    roomController.getAll
);

router.get(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem ver um quarto pelo id
    roomController.getById
);

router.put(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem editar quartos
    roomController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem deletar quartos
    roomController.remove
);

export default router;
