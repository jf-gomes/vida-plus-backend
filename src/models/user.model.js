// src/models/user.model.js
// Modelo Sequelize para a entidade User (base)

import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

// Definição do Modelo User
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    genre: {
        type: DataTypes.ENUM('M', 'F', 'Outro'),
        allowNull: true,
    },
    dob: { // Date of Birth (dob)
        type: DataTypes.DATEONLY, // Apenas data, sem tempo
        allowNull: false,
    },
    role: { // Para diferenciar Patient, HealthProfessional e Admin
        type: DataTypes.ENUM('Patient', 'HealthProfessional', 'Admin'),
        allowNull: false,
        defaultValue: 'Patient'
    }
}, {
    // Opções do Modelo
    tableName: 'User', // Garante o nome exato da tabela
    // createdAt e updatedAt (já configurados em connection.js com underscored: true)
});

// Método de instância de login simulado
User.prototype.login = function() {
    console.log(`[User] ${this.username} logou.`);
    // Lógica real: comparar senha, gerar token JWT, etc.
    return true;
};

// Hook (Gatilho) para ocultar a senha em consultas (exemplo)
// ATENÇÃO: Selecionar campos no serviço é geralmente mais limpo.
/*
User.addHook('afterFind', (users) => {
    if (Array.isArray(users)) {
        users.forEach(user => delete user.dataValues.password);
    } else if (users) {
        delete users.dataValues.password;
    }
});
*/

export default User;
