import { Router } from 'express';
import * as supplyController from '../controllers/supply.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = Router();

//abaixo estão as rotas da entidade Supply
//cada rota chama uma função do controller
//algumas funções necessitam do authorize para serem chamadas
router.post(
    '/create',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem criar suprimentos
    supplyController.create
);

router.get(
    '/',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem ver todos os suprimentos
    supplyController.getAll
);

router.get(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem ver um suprimento pelo id
    supplyController.getById
);

router.put(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem editar suprimentos
    supplyController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem deletar suprimentos
    supplyController.remove
);

export default router;
