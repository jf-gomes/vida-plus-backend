import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';

const router = Router();

router.post('/create', roomController.create);

router.get('/', roomController.getAll);

router.get('/:id', roomController.getById);

router.put('/:id', roomController.update);

router.delete('/:id', roomController.remove);

export default router;
