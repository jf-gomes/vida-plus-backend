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

/**
 * NOVO: Busca uma receita por ID, verificando a permissão de visualização.
 * @param {number} id - ID da receita.
 * @param {number} userId - ID do usuário logado.
 * @param {string} role - Papel do usuário logado.
 */
export const getPrescriptionById = async (id, userId, role) => {
    // 1. Busca a receita, incluindo os relacionamentos
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

    // 2. Verifica a permissão de visualização
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
 * ATUALIZA uma receita médica existente.
 * @param {number} id - ID da receita.
 * @param {object} data - Dados a serem atualizados.
 * @param {number} userId - ID do usuário logado.
 */

export const updatePrescription = async (id, data, userId) => {
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
        'Apenas o criador ou Administrador podem editar esta receita.'
    );

    // 3. Checagem de permissão: Se for HP, deve ter criado a receita
    if (userRole === 'HealthProfessional' && prescription.assignedBy !== userId) {
        const error = new Error('Você só pode editar as receitas que você criou.');
        error.statusCode = 403;
        throw error;
    }
    
    // 4. Se a receita estiver sendo alterada, garante que os campos cruciais (como assignedBy)
    // não sejam alterados via requisição PUT, pois são definidos pelo sistema.
    delete data.assignedBy;
    delete data.assignedTo;

    // 5. Realiza a atualização
    await prescription.update(data);
    
    return prescription;
};

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