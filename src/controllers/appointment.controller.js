import * as appointmentService from '../services/appointment.service.js';

//============ FUNÇÕES CRUD ============

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

export const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { id: userId, role } = req.user;
        
        const appointment = await appointmentService.getAppointmentById(id, userId, role);
        res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const updatedAppointment = await appointmentService.updateAppointment(id, req.body, userId);
        res.status(200).json(updatedAppointment);
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