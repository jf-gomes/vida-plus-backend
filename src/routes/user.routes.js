import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = Router();

//abaixo estão as rotas da entidade User
//cada rota chama uma função do controller
//algumas funções necessitam do authorize para serem chamadas
router.post(
    '/register',
    userController.register
    //todos podem se cadastrar
    //por padrão, o cadastro recebe um role de "patient"
);

router.post(
    '/login',
    userController.login
    //todos podem logar
);

router.get(
    '/',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem ver todos os usuários
    userController.getAll
);

router.get(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem ver um usuário pelo id
    userController.getById
    //pacientes podem visualizar seu respectivo usuário
);

router.put(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem editar usuários
    userController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']), //apenas profissionais da saúde e administradores podem deletar usuários
    userController.remove
);

export default router;
