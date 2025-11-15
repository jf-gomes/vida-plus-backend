import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = Router();

router.post(
    '/create',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    roomController.create
);

router.get(
    '/',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    roomController.getAll
);

router.get(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    roomController.getById
);

router.put(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    roomController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    roomController.remove
);

export default router;
