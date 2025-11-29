import { Router } from 'express';
import * as prescriptionController from '../controllers/prescription.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'; 

const router = Router();

//abaixo estão as rotas da entidade Prescription
//cada rota chama uma função do controller
//algumas funções necessitam do authorize para serem chamadas
router.post(
    '/', 
    authenticate, 
    authorize(['HealthProfessional', 'Admin']), //apenas profissionais da saúde e administradores podem criar receitas
    prescriptionController.create
);

router.get(
    '/', 
    authenticate, 
    prescriptionController.getAll
    //aqui não é utilizado authorize, pois a verificação ocorre no prescription.controller.js
    //paciente vê todas as receitas atribuídas a ele
    //médico vê todas as receitas geradas por ele
    //administrador vê todas as receitas
);

router.get(
    '/:id', 
    authenticate, 
    prescriptionController.getById
    //aqui não é utilizado authorize, pois a verificação ocorre no prescription.controller.js
    //paciente vê todas as receitas atribuídas a ele
    //médico vê todas as receitas geradas por ele
    //administrador vê todas as receitas
);

router.put(
    '/:id', 
    authenticate, 
    authorize(['HealthProfessional', 'Admin']), //apenas profissionais da saúde e administradores podem editar receitas
    prescriptionController.update
    //médico edita todas as receitas geradas por ele
    //administrador edita todas as receitas
);

router.delete(
    '/:id', 
    authenticate, 
    prescriptionController.remove
    //aqui não é utilizado authorize, pois a verificação ocorre no prescription.controller.js
    //paciente deleta todas as receitas atribuídas a ele
    //médico deleta todas as receitas geradas por ele
    //administrador deleta todas as receitas
);

export default router;