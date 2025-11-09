import Appointment from '../models/appointment.model.js';

export const createAppointment = async (appointmentData) => {

    const { patient, healthProfessional, date, details, online, room } = appointmentData; 

    const appointment = await Appointment.create({ 
        patient,
        healthProfessional,
        date,
        details,
        online,
        room
    });

    return { appointment };
};

export const getAllAppointments = async () => {
    return Appointment.findAll();
};

export const getAppointmentById = async (id) => {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
        const error = new Error('Agendamento não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return appointment;
};

export const updateAppointment = async (id, appointmentData) => {
    const [updated] = await Appointment.update(appointmentData, { where: { id } });
    if (!updated) {
        const error = new Error('Agendamento não encontrado para atualização.');
        error.statusCode = 404;
        throw error;
    }
    return getAppointmentById(id);
};

export const removeAppointment = async (id) => {
    const deleted = await Appointment.destroy({ where: { id } });
    if (!deleted) {
        const error = new Error('Agendamento não encontrado para remoção.');
        error.statusCode = 404;
        throw error;
    }
};