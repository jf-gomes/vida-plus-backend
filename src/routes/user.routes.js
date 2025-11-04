// src/routes/user.routes.js
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// --- ROTAS DE AUTENTICAÇÃO ---

// POST /register - Cria um novo usuário e retorna um token
router.post('/register', userController.register);

// POST /login - Realiza o login e retorna um token
router.post('/login', userController.login);


// --- ROTAS CRUD (REQUEREM AUTENTICAÇÃO FUTURAMENTE) ---

// GET / - Lista todos os usuários
router.get('/', userController.getAll);

// GET /:id - Obtém um usuário por ID
router.get('/:id', userController.getById);

// POST / - Cria um novo usuário (mantido apenas por coerência do CRUD inicial)
// router.post('/', userController.create); // Use /register para criação de conta completa

// PUT /:id - Atualiza um usuário
router.put('/:id', userController.update);

// DELETE /:id - Remove um usuário
router.delete('/:id', userController.remove);

export default router;
