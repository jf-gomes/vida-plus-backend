import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = Router();

router.post(
    '/create',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    appointmentController.create
);

router.get(
    '/',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    appointmentController.getAll
);

router.get(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    appointmentController.getById
);

router.put(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    appointmentController.update
);

router.delete(
    '/:id',
    authenticate,
    authorize(['Admin', 'HealthProfessional']),
    appointmentController.remove
);

export default router;
