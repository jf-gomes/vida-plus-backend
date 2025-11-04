// src/middlewares/auth.middleware.js
// Esqueleto de Middleware de Autenticação e Autorização (Placeholder)

/**
 * Middleware para verificar se o token JWT é válido.
 */
export const authenticate = (req, res, next) => {
    console.log('[Auth Middleware] Verificando autenticação...');
    // Lógica real: Decodificar JWT, buscar usuário no DB, anexar req.user
    next();
};

/**
 * Middleware para verificar se o usuário tem a permissão necessária.
 * @param {string[]} allowedRoles - Papéis permitidos (e.g., ['Admin', 'HealthProfessional']).
 */
export const authorize = (allowedRoles) => (req, res, next) => {
    console.log('[Auth Middleware] Verificando autorização...');
    // Lógica real: Verificar req.user.role contra allowedRoles
    next();
};
