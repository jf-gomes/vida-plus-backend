// src/database/connection.js
// Configuração de conexão e instância Sequelize (MySQL)

import { Sequelize } from 'sequelize';
import { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, NODE_ENV } from '../config/env.js';

// Inicializa a instância do Sequelize
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: NODE_ENV === 'development' ? (msg) => console.log(`[SQL] ${msg}`) : false,
    define: {
        freezeTableName: true, // Evita que o Sequelize pluralize o nome das tabelas
        underscored: true,     // Usa snake_case para colunas criadas automaticamente (createdAt, updatedAt)
    },
    dialectOptions: {
        // Opções específicas para o driver mysql2
    }
});

/**
 * Autentica e sincroniza a conexão com o banco de dados.
 */
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`[Database] Conexão com o MySQL em ${DB_HOST}:${DB_PORT} estabelecida com sucesso.`);
        
        // Sincroniza todos os modelos definidos (cria tabelas se não existirem)
        // ATENÇÃO: { force: true } destrói e recria tabelas! Use com cautela.
        // { alter: true } é mais seguro para desenvolvimento.
        await sequelize.sync({ alter: NODE_ENV === 'development' }); 
        console.log('[Database] Modelos sincronizados com o banco de dados.');
        
    } catch (error) {
        console.error('[Database] Falha na conexão/sincronização com o MySQL:', error.message);
        // Em caso de falha crítica na conexão inicial, o ideal é sair do processo.
        // process.exit(1); 
    }
};

export { sequelize, connectDB };