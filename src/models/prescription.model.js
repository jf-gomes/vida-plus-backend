// src/models/prescription.model.js
// Modelo Sequelize para a entidade Prescription (Receita Médica)

import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';
import User from './user.model.js'; // Importa o modelo User para os relacionamentos

const Prescription = sequelize.define('Prescription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Chave estrangeira para o Paciente
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Aponta para a tabela User (que inclui Patients)
            key: 'id',
        },
        field: 'patient_id', // Nome da coluna no banco de dados
    },
    // Chave estrangeira para o Profissional de Saúde
    assignedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Aponta para a tabela User (que inclui HealthProfessionals)
            key: 'id',
        },
        field: 'health_professional_id', // Nome da coluna no banco de dados
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    // Campo 'deleted' do diagrama: Adiciona um flag para exclusão lógica
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'Prescription',
    paranoid: true, // Habilita a exclusão lógica (adiciona o campo deletedAt)
});

// Configuração dos relacionamentos
// CORREÇÃO CRÍTICA: Adicionando onDelete: 'CASCADE' (ou 'RESTRICT') para evitar conflito 
// com 'allowNull: false'. Se a coluna for NOT NULL, o SET NULL não pode ser usado.
Prescription.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id', onDelete: 'CASCADE' });
Prescription.belongsTo(User, { as: 'HealthProfessional', foreignKey: 'health_professional_id', onDelete: 'CASCADE' });

// Sincroniza o modelo com o DB para garantir que a tabela seja criada
Prescription.sync();

export default Prescription;