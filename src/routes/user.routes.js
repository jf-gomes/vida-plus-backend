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
    authenticate,
    authorize,
    userController.getAll
);

router.get(
    '/:id',
    authenticate,
    authorize,
    userController.getById
);

router.put(
    '/:id',
    authenticate,
    authorize,
    userController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize,
    userController.remove
);

export default router;
