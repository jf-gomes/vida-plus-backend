/**
 * @param {object} schema - O esquema de validação.
 * @param {string} source - 'body', 'query', ou 'params'.
 */

export const validate = (schema, source = 'body') => (req, res, next) => {
    console.log(`[Validation Middleware] Validando ${source}...`);

    next();
};
