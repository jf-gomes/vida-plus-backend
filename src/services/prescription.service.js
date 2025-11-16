import Prescription from '../models/prescription.model.js';
import User from '../models/user.model.js';

const checkUserRole = async (userId, allowedRoles, errorMessage) => {
    const user = await User.findByPk(userId, { attributes: ['role'] });
    if (!user || !allowedRoles.includes(user.role)) {
        const error = new Error(errorMessage);
        error.statusCode = 403; // Forbidden
        throw error;
    }
    return user.role;
};

// --- FUNÇÕES CRUD ---

/**
 * Cria uma nova receita médica.
 * @param {object} data - Dados da receita, incluindo patient_id e health_professional_id.
 * @param {number} assignedById - ID do profissional logado (vem do req.user).
 */
export const createPrescription = async (data, assignedById) => {

    await checkUserRole(
        assignedById, 
        ['HealthProfessional', 'Admin'], 
        'Apenas Profissionais de Saúde ou Administradores podem criar receitas.'
    );

    data.assignedBy = assignedById;
    
    const patient = await User.findByPk(data.assignedTo, { attributes: ['role'] });
    if (!patient || patient.role !== 'Patient') {
        const error = new Error('Paciente associado não é válido ou não foi encontrado.');
        error.statusCode = 400;
        throw error;
    }

    const prescription = await Prescription.create(data);
    return prescription;
};

/**
 * Busca todas as receitas (para Admin) ou receitas específicas do profissional/paciente.
 * @param {string} role - Papel do usuário logado.
 * @param {number} userId - ID do usuário logado.
 */
export const getAllPrescriptions = async (role, userId) => {
    let whereClause = {};

    // Se for HealthProfessional, vê apenas as que ele criou
    if (role === 'HealthProfessional') {
        whereClause = { assignedBy: userId };
    } 
    // Se for Patient, vê apenas as que lhe foram atribuídas
    else if (role === 'Patient') {
        whereClause = { assignedTo: userId };
    }
    // Se for Admin, vê todas (whereClause fica vazio)
    
    // Inclui informações do paciente e do profissional
    return Prescription.findAll({
        where: whereClause,
        include: [
            { model: User, as: 'Patient', attributes: ['id', 'userName', 'name'] },
            { model: User, as: 'HealthProfessional', attributes: ['id', 'userName', 'name'] }
        ],
        order: [['createdAt', 'DESC']]
    });
};

/**
 * Deleta uma receita (exclusão lógica).
 * @param {number} id - ID da receita.
 * @param {number} userId - ID do usuário logado.
 */
export const deletePrescription = async (id, userId) => {
    // 1. Busca a receita
    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
        const error = new Error('Receita não encontrada.');
        error.statusCode = 404;
        throw error;
    }

    // 2. Verifica se o usuário logado é o HealthProfessional que a criou ou é Admin
    const userRole = await checkUserRole(
        userId, 
        ['HealthProfessional', 'Admin'], 
        'Apenas o criador ou Administrador podem deletar esta receita.'
    );

    if (userRole === 'HealthProfessional' && prescription.assignedBy !== userId) {
        const error = new Error('Você só pode deletar as receitas que você criou.');
        error.statusCode = 403;
        throw error;
    }

    // 3. Exclui logicamente (paranoid: true no modelo)
    await prescription.destroy();
    return true;
};