// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { getUserById } from '../services/user.service.js';

// --- MIDDLEWARE DE AUTENTICAÇÃO ---

export const authenticate = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new Error('Acesso negado. Token não fornecido.');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Busca o usuário para confirmar a existência e pegar os dados mais recentes
        const user = await getUserById(decoded.id);

        if (!user) {
            const error = new Error('Usuário associado ao token não encontrado.');
            error.statusCode = 401;
            return next(error);
        }

        // Anexa as informações do usuário (id e role) ao objeto de requisição
        req.user = {
            id: user.id,
            role: user.role
        };
        
        next();
    } catch (error) {
        const authError = new Error('Token inválido ou expirado.');
        authError.statusCode = 401;
        next(authError);
    }
};

// --- MIDDLEWARE DE AUTORIZAÇÃO POR PAPEL ---

/**
 * Retorna um middleware que restringe o acesso aos papéis especificados.
 * @param {Array<string>} roles - Array de papéis permitidos (ex: ['Admin', 'HealthProfessional'])
 */
export const authorize = (roles) => (req, res, next) => {
    // 1. Verifica se o usuário foi anexado pelo middleware 'authenticate'
    if (!req.user || !req.user.role) {
        // Se a autenticação não rodou antes, o usuário não tem papel definido.
        // Isso não deve acontecer se 'authenticate' for chamado antes,
        // mas é uma boa proteção.
        const error = new Error('Acesso negado. Autenticação pendente.');
        error.statusCode = 403;
        return next(error);
    }

    // 2. Verifica se o papel do usuário está no array de papéis permitidos
    if (!roles.includes(req.user.role)) {
        const error = new Error('Acesso negado. Você não tem permissão para esta ação.');
        error.statusCode = 403;
        return next(error);
    }

    // 3. Papel autorizado, segue para a próxima função
    next();
};