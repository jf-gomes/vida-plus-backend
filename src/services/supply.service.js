import Supply from '../models/supply.model.js';

export const createSupply = async (supplyData) => {

    const { code, description, quantity } = supplyData; 

    const supply = await Supply.create({ 
        code,
        description,
        quantity
    });

    return { supply };
};

export const getAllSupplies = async () => {
    return Supply.findAll();
};

export const getSupplyById = async (id) => {
    const supply = await Supply.findByPk(id);
    if (!supply) {
        const error = new Error('Suprimento não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return supply;
};

export const updateSupply = async (id, supplyData) => {
    const [updated] = await Supply.update(supplyData, { where: { id } });
    if (!updated) {
        const error = new Error('Suprimento não encontrado para atualização.');
        error.statusCode = 404;
        throw error;
    }
    return getSupplyById(id);
};

export const removeSupply = async (id) => {
    const deleted = await Supply.destroy({ where: { id } });
    if (!deleted) {
        const error = new Error('Suprimento não encontrado para remoção.');
        error.statusCode = 404;
        throw error;
    }
};