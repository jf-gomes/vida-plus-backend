import { Router } from 'express';
import * as supplyController from '../controllers/supply.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = Router();

router.post(
    '/create',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    supplyController.create
);

router.get(
    '/',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    supplyController.getAll
);

router.get(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    supplyController.getById
);

router.put(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    supplyController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    supplyController.remove
);

export default router;
