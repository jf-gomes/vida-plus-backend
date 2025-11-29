import * as appointmentService from '../services/appointment.service.js';

//============ FUNÇÕES CRUD ============
//a proteção ocorre no arquivo de rotas
export const create = async (req, res, next) => {
    try {
        const assignedById = req.user.id; 
        const appointment = await appointmentService.createAppointment(req.body, assignedById);
        res.status(201).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { role, id } = req.user; 
        const appointments = await appointmentService.getAllAppointments(role, id);
        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        await appointmentService.deleteAppointment(req.params.id, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};