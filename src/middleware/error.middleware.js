const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    console.error(`[Error Middleware] Status: ${statusCode}, Path: ${req.path}`, err.message);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Erro interno do servidor.',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorMiddleware;
