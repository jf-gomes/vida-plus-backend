import { Router } from 'express';
import * as prescriptionController from '../controllers/prescription.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'; 

const router = Router();

const REQUIRED_ROLES_FOR_CREATION = ['HealthProfessional', 'Admin'];

router.post(
    '/', 
    authenticate, 
    authorize(REQUIRED_ROLES_FOR_CREATION), 
    prescriptionController.create
);

router.get(
    '/', 
    authenticate, 
    prescriptionController.getAll
);

router.get(
    '/:id', 
    authenticate, 
    prescriptionController.getById
);

router.put(
    '/:id', 
    authenticate, 
    authorize(REQUIRED_ROLES_FOR_CREATION), 
    prescriptionController.update
);

router.delete(
    '/:id', 
    authenticate, 
    prescriptionController.remove
);

export default router;