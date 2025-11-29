import Prescription from '../models/prescription.model.js';
import User from '../models/user.model.js';

const checkUserRole = async (userId, allowedRoles, errorMessage) => {
    const user = await User.findByPk(userId, { attributes: ['role'] });
    if (!user || !allowedRoles.includes(user.role)) {
        const error = new Error(errorMessage);
        error.statusCode = 403;
        throw error;
    }
    return user.role;
};

/**
 * @param {object} data
 * @param {number} assignedById
 */

//apenas profissionais de saúde e administradores podem criar receitas
// a função checkUserRole garante isso
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
 * @param {string} role
 * @param {number} userId
 */

//se o usuário for profissional de saúde, só poderá visualizar as receitas geradas por ele
//se o usuário for paciente, só poderá visualizar as receitas atribuídas a ele
export const getAllPrescriptions = async (role, userId) => {
    let whereClause = {};

    if (role === 'HealthProfessional') {
        whereClause = { assignedBy: userId };
    } 

    else if (role === 'Patient') {
        whereClause = { assignedTo: userId };
    }

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
 * @param {number} id - ID da receita.
 * @param {number} userId - ID do usuário logado.
 */

/**
 * @param {number} id - ID da receita.
 * @param {number} userId - ID do usuário logado.
 * @param {string} role - Papel do usuário logado.
 */

//verifica se o usuário é o paciente cuja receita está atribuída, médico que gerou a receita ou administrador
export const getPrescriptionById = async (id, userId, role) => {

    const prescription = await Prescription.findByPk(id, {
        include: [
            { model: User, as: 'Patient', attributes: ['id', 'userName', 'name'] },
            { model: User, as: 'HealthProfessional', attributes: ['id', 'userName', 'name'] }
        ],
    });

    if (!prescription) {
        const error = new Error('Receita não encontrada.');
        error.statusCode = 404;
        throw error;
    }

    const isOwnerPatient = prescription.assignedTo === userId && role === 'Patient';
    const isAssignedHealthProfessional = prescription.assignedBy === userId && role === 'HealthProfessional';
    const isAdmin = role === 'Admin';

    if (isAdmin || isOwnerPatient || isAssignedHealthProfessional) {
        return prescription;
    } else {
        const error = new Error('Acesso negado. Você não tem permissão para visualizar esta receita.');
        error.statusCode = 403; // Forbidden
        throw error;
    }
};


/**
 * @param {number} id - ID da receita.
 * @param {object} data - Dados a serem atualizados.
 * @param {number} userId - ID do usuário logado.
 */

//verifica se o usuário é o médico que gerou a receita ou administrador
export const updatePrescription = async (id, data, userId) => {

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
        const error = new Error('Receita não encontrada.');
        error.statusCode = 404;
        throw error;
    }

    const userRole = await checkUserRole(
        userId, 
        ['HealthProfessional', 'Admin'], 
        'Apenas o criador ou Administrador podem editar esta receita.'
    );

    if (userRole === 'HealthProfessional' && prescription.assignedBy !== userId) {
        const error = new Error('Você só pode editar as receitas que você criou.');
        error.statusCode = 403;
        throw error;
    }

    delete data.assignedBy;
    delete data.assignedTo;
    await prescription.update(data);
    
    return prescription;
};

//verifica se o usuário é o médico que gerou a receita ou administrador
export const deletePrescription = async (id, userId) => {

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
        const error = new Error('Receita não encontrada.');
        error.statusCode = 404;
        throw error;
    }

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

    await prescription.destroy();
    return true;
};