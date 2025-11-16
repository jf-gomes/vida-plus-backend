import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'; 

const router = Router();

const REQUIRED_ROLES_FOR_CREATION = ['HealthProfessional', 'Admin'];

router.post(
    '/', 
    authenticate,
    authorize(REQUIRED_ROLES_FOR_CREATION), 
    appointmentController.create
);

router.get(
    '/', 
    authenticate,
    appointmentController.getAll
);

router.delete(
    '/:id', 
    authenticate,
    appointmentController.remove
);

export default router;