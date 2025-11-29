import * as supplyService from '../services/supply.service.js';

//============ FUNÇÕES CRUD ============

export const getAll = async (req, res, next) => {
    try {
        const supplies = await supplyService.getAllSupplies();
        res.status(200).json(supplies);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const supplies = await supplyService.getSupplyById(req.params.id);
        res.status(200).json(supplies);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const supply = await supplyService.createSupply(req.body);
        res.status(201).json(supply);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const supply = await supplyService.updateSupply(req.params.id, req.body);
        res.status(200).json(supply);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await supplyService.removeSupply(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};