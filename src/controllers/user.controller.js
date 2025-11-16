import * as userService from '../services/user.service.js';

export const register = async (req, res, next) => {
    try {
    
        const { user, token } = await userService.registerUser(req.body); 

        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {

        const { username, password } = req.body; 
        const { user, token } = await userService.loginUser(username, password);

        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await userService.removeUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};