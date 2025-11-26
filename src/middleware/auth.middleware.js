import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { getUserById } from '../services/user.service.js';

export const authenticate = async (req, res, next) => {
    let token;
    
    if (req.cookies && req.cookies.access_token) {
        token = req.cookies.access_token;
    }

    if (!token) {
        const error = new Error('Acesso negado. Token não fornecido.');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await getUserById(decoded.id);

        if (!user) {
            const error = new Error('Usuário associado ao token não encontrado.');
            error.statusCode = 401;
            return next(error);
        }

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

/**
 * @param {Array<string>} roles
 */

export const authorize = (roles) => (req, res, next) => {

    if (!req.user || !req.user.role) {

        const error = new Error('Acesso negado. Autenticação pendente.');
        error.statusCode = 403;
        return next(error);
    }

    if (!roles.includes(req.user.role)) {
        const error = new Error('Acesso negado. Você não tem permissão para esta ação.');
        error.statusCode = 403;
        return next(error);
    }

    next();
};