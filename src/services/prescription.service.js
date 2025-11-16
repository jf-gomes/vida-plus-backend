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