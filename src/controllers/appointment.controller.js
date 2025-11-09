import * as appointmentService from '../services/appointment.service.js';

export const getAll = async (req, res, next) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
        res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await appointmentService.removeAppointment(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};