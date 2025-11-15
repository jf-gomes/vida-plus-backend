import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt)
};

const comparePassword = async (providedPassword, storedPassword) => {
    return bcrypt.compare(providedPassword, storedPassword)
};

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
};

// ===== AUTENTICAÇÃO ======

export const registerUser = async (userData) => {

    const { username, password, name, genre, dob, role } = userData; 

    // Verifica se o username foi fornecido.
    if (!username) {
        const error = new Error('O campo username é obrigatório.');
        error.statusCode = 400;
        throw error;
    }

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
        const error = new Error('Nome de usuário já está em uso.');
        error.statusCode = 400;
        throw error;
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    const user = await User.create({ 
        username: username, // Mapeamento explícito
        password: hashedPassword, 
        name, 
        genre, 
        dob,
        role
    });

    // Gera o token (register)
    const token = generateToken({ id: user.id });

    return { user, token };
};

export const loginUser = async (username, password) => {

    if (!username) {
        const error = new Error('O campo username é obrigatório para o login.');
        error.statusCode = 400;
        throw error;
    }
    
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
        const error = new Error('Usuário ou senha inválidos.');
        error.statusCode = 401;
        throw error;
    }

    // Comparação da senha
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        const error = new Error('Usuário ou senha inválidos.');
        error.statusCode = 401;
        throw error;
    }

    // Gera o token (login)
    const token = generateToken({ id: user.id });

    return { user, token };
};


// ===== CRUD ======

export const getAllUsers = async () => {
    return User.findAll();
};

export const getUserById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

export const createUser = async (userData) => {
    return User.create(userData);
};

export const updateUser = async (id, userData) => {
    const [updated] = await User.update(userData, { where: { id } });
    if (!updated) {
        const error = new Error('Usuário não encontrado para atualização.');
        error.statusCode = 404;
        throw error;
    }
    return getUserById(id);
};

export const removeUser = async (id) => {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
        const error = new Error('Usuário não encontrado para remoção.');
        error.statusCode = 404;
        throw error;
    }
};