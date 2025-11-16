import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';
import User from './user.model.js'

const Prescription = sequelize.define('Prescription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // ID do cadastro do profissional responsável pela receita
    assignedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        field: 'health_professional_id'
    },
    // ID do cadastro do paciente responsável pela receita
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        field: 'patient_id'
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'Prescription',
    paranoid: true,
});

Prescription.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });
Prescription.belongsTo(User, { as: 'HealthProfessional', foreignKey: 'health_professional_id' });

Prescription.sync();

export default Prescription;
