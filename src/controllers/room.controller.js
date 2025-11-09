import * as roomService from '../services/room.service.js';

export const getAll = async (req, res, next) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.status(200).json(rooms);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const room = await roomService.getRoomById(req.params.id);
        res.status(200).json(room);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const room = await roomService.createRoom(req.body);
        res.status(201).json(room);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const room = await roomService.updateRoom(req.params.id, req.body);
        res.status(200).json(room);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await roomService.removeRoom(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};