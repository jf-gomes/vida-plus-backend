import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = Router();

router.post(
    '/register',
    userController.register
);

router.post(
    '/login',
    userController.login
);

router.get(
    '/',
    userController.getAll
);

router.get(
    '/:id',
    userController.getById
);

router.put(
    '/:id',
    userController.update
);

router.delete(
    '/:id',
    userController.remove
);

export default router;
