import { Sequelize } from 'sequelize';

//importação das variáveis de ambiente
import { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, NODE_ENV } from '../config/env.js';

//configurações do sequelize
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: NODE_ENV === 'development' ? (msg) => console.log(`[SQL] ${msg}`) : false,
    define: {
        freezeTableName: true,
        underscored: true,
    },
    dialectOptions: {}
});

//conexão com o banco via sequelize
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`[Database] Conexão com o MySQL em ${DB_HOST}:${DB_PORT} estabelecida com sucesso.`);
        
        await sequelize.sync({ alter: NODE_ENV === 'development' }); 
        console.log('[Database] Modelos sincronizados com o banco de dados.');
        
    } catch (error) {
        console.error('[Database] Falha na conexão/sincronização com o MySQL:', error.message);
    }
};

export { sequelize, connectDB };