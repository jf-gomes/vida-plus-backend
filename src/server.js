import app from './app.js';
import { connectDB } from './database/connection.js';
import { PORT, NODE_ENV } from './config/env.js';


//ponto de entrada da api
async function startServer() {

    //conecta ao banco na porta 3306
    await connectDB();

    app.listen(PORT, () => {
        console.log(`[Server] Servidor rodando em http://localhost:${PORT}`);
        console.log(`[Server] Ambiente: ${NODE_ENV}`);
    });
}

startServer();
