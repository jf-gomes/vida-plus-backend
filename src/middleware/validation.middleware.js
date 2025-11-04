// src/middlewares/validation.middleware.js
// Esqueleto de Middleware de Validação (Placeholder)

/**
 * Função de fábrica para criar um middleware de validação (usando Joi, Zod, etc.)
 * @param {object} schema - O esquema de validação.
 * @param {string} source - 'body', 'query', ou 'params'.
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
    console.log(`[Validation Middleware] Validando ${source}...`);
    // Lógica real: Executar schema.validate(req[source])
    next();
};
