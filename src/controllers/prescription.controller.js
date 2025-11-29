import * as prescriptionService from '../services/prescription.service.js';

//============ FUNÇÕES CRUD ============

export const create = async (req, res, next) => {
    try {
        const assignedById = req.user.id; 
        const prescription = await prescriptionService.createPrescription(req.body, assignedById);
        res.status(201).json(prescription);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { role, id } = req.user; 
        const prescriptions = await prescriptionService.getAllPrescriptions(role, id);
        res.status(200).json(prescriptions);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { id: userId, role } = req.user;
        
        const prescription = await prescriptionService.getPrescriptionById(id, userId, role);
        res.status(200).json(prescription);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const updatedPrescription = await prescriptionService.updatePrescription(id, req.body, userId);
        res.status(200).json(updatedPrescription);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const userId = req.user.id; 
        await prescriptionService.deletePrescription(req.params.id, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};