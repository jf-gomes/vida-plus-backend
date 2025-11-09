import Room from '../models/room.model.js';

export const createRoom = async (roomData) => {

    const { type, capacity } = roomData; 

    const room = await Room.create({ 
        type,
        capacity
    });

    return { room };
};

export const getAllRooms = async () => {
    return Room.findAll();
};

export const getRoomById = async (id) => {
    const room = await Room.findByPk(id);
    if (!room) {
        const error = new Error('Quarto não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return room;
};

export const updateRoom = async (id, roomData) => {
    const [updated] = await Room.update(roomData, { where: { id } });
    if (!updated) {
        const error = new Error('Quarto não encontrado para atualização.');
        error.statusCode = 404;
        throw error;
    }
    return getRoomById(id);
};

export const removeRoom = async (id) => {
    const deleted = await Room.destroy({ where: { id } });
    if (!deleted) {
        const error = new Error('Quarto não encontrado para remoção.');
        error.statusCode = 404;
        throw error;
    }
};