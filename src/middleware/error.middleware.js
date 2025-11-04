// src/middlewares/error.middleware.js
// Middleware centralizado para tratamento de erros

/**
 * Middleware para tratar erros e enviar uma resposta JSON padronizada.
 */
const errorMiddleware = (err, req, res, next) => {
    // Determina o código de status
    const statusCode = err.statusCode || 500;

    console.error(`[Error Middleware] Status: ${statusCode}, Path: ${req.path}`, err.message);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Erro interno do servidor.',
        // Inclui stack trace apenas em ambiente de desenvolvimento
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorMiddleware;
