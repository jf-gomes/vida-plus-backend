import app from './app.js';
import { connectDB } from './database/connection.js';
import { PORT, NODE_ENV } from './config/env.js';

async function startServer() {

    await connectDB();

    app.listen(PORT, () => {
        console.log(`[Server] Servidor rodando em http://localhost:${PORT}`);
        console.log(`[Server] Ambiente: ${NODE_ENV}`);
    });
}

startServer();
