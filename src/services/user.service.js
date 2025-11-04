// src/services/user.service.js
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

// ** ATENÇÃO: É necessário instalar 'bcrypt' e 'jsonwebtoken' para que estas funções funcionem. **
// Exemplo: npm install bcrypt jsonwebtoken

// Função auxiliar (placeholder) para simular o hash da senha
const hashPassword = async (password) => {
    // const salt = await bcrypt.genSalt(10);
    // return bcrypt.hash(password, salt);
    console.warn("AVISO: Usando senha em texto claro. Instale e use bcrypt!");
    return password; // Simulação SEM hash
};

// Função auxiliar (placeholder) para simular a comparação da senha
const comparePassword = async (providedPassword, storedPassword) => {
    // return bcrypt.compare(providedPassword, storedPassword);
    console.warn("AVISO: Comparando senhas em texto claro. Instale e use bcrypt!");
    return providedPassword === storedPassword; // Simulação SEM comparação segura
};

// Função auxiliar (placeholder) para simular a geração do token JWT
const generateToken = (payload) => {
    // return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    console.warn("AVISO: Gerando token simulado. Instale e use jsonwebtoken!");
    return `SIMULATED_JWT_FOR_USER_${payload.id}`;
};

// --- FUNÇÕES DE AUTENTICAÇÃO ---

export const registerUser = async (userData) => {
    // CORREÇÃO: Usar 'username' para desestruturar e mapear para 'userName' do modelo
    const { username, password, name, genre, dob } = userData; 

    // Se o campo obrigatório 'username' não for fornecido, lança erro
    if (!username) {
        const error = new Error('O campo username é obrigatório.');
        error.statusCode = 400;
        throw error;
    }

    // Verifica se o usuário já existe
    // Mapeia o campo de entrada 'username' (minúscula) para a coluna 'userName' (camelCase do modelo)
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
        const error = new Error('Nome de usuário já está em uso.');
        error.statusCode = 400;
        throw error;
    }

    // Hash da senha (substituir por bcrypt real)
    const hashedPassword = await hashPassword(password);

    // Cria o usuário: Mapeia o campo de entrada 'username' (minúscula) para a coluna 'userName'
    const user = await User.create({ 
        username: username, // Mapeamento explícito
        password: hashedPassword, 
        name, 
        genre, 
        dob
        // Se houver mais campos, eles devem ser incluídos aqui
    });

    // Gera o token (opcionalmente)
    const token = generateToken({ id: user.id });

    return { user, token };
};

export const loginUser = async (username, password) => {
    // 1. Busca o usuário pelo userName (campo do modelo) usando o valor de username (input)
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

    // 2. Compara a senha (substituir por bcrypt real)
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        const error = new Error('Usuário ou senha inválidos.');
        error.statusCode = 401;
        throw error;
    }

    // 3. Gera o token JWT
    const token = generateToken({ id: user.id });

    return { user, token };
};


// --- FUNÇÕES CRUD EXISTENTES ---

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