import Appointment from '../models/appointment.model.js';
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

/**
 * @param {object} data
 * @param {number} assignedById
 */

//apenas profissionais de saúde e administradores podem criar consultas
// a função checkUserRole garante isso
export const createAppointment = async (data, assignedById) => {

    await checkUserRole(
        assignedById, 
        ['HealthProfessional', 'Admin'], 
        'Apenas Profissionais de Saúde ou Administradores podem criar agendamentos.'
    );

    data.assignedBy = assignedById;
    
    const patient = await User.findByPk(data.assignedTo, { attributes: ['role'] });
    if (!patient || patient.role !== 'Patient') {
        const error = new Error('Paciente associado não é válido ou não foi encontrado.');
        error.statusCode = 400;
        throw error;
    }

    const appointment = await Appointment.create(data);
    return appointment;
};

/**
 * @param {string} role
 * @param {number} userId
 */

//se o usuário for profissional de saúde, só poderá visualizar as receitas geradas por ele
//se o usuário for paciente, só poderá visualizar as receitas atribuídas a ele
export const getAllAppointments = async (role, userId) => {
    let whereClause = {};

    if (role === 'HealthProfessional') {
        whereClause = { assignedBy: userId };
    } 

    else if (role === 'Patient') {
        whereClause = { assignedTo: userId };
    }

    return Appointment.findAll({
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

//verifica se o usuário é o médico que gerou a receita ou administrador
export const deleteAppointment = async (id, userId) => {

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
        const error = new Error('Consulta não encontrada.');
        error.statusCode = 404;
        throw error;
    }

    const userRole = await checkUserRole(
        userId, 
        ['HealthProfessional', 'Admin'], 
        'Apenas o criador ou Administrador podem deletar esta receita.'
    );

    if (userRole === 'HealthProfessional' && prescription.assignedBy !== userId) {
        const error = new Error('Você só pode deletar os agendamentos que você criou.');
        error.statusCode = 403;
        throw error;
    }

    await appointment.destroy();
    return true;
};