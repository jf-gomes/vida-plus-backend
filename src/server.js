// src/server.js
// Ponto de entrada da aplicação

import app from './app.js';
import { connectDB } from './database/connection.js';
import { PORT, NODE_ENV } from './config/env.js';

// Função principal para iniciar o servidor
async function startServer() {
    // 1. Tenta conectar ao banco de dados
    await connectDB();

    // 2. Inicia o servidor Express
    app.listen(PORT, () => {
        console.log(`[Server] Servidor rodando em http://localhost:${PORT}`);
        console.log(`[Server] Ambiente: ${NODE_ENV}`);
    });
}

startServer();
