import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';
import User from './user.model.js';

const Prescription = sequelize.define('Prescription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        field: 'patient_id',
    },

    assignedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        field: 'health_professional_id',
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'Prescription',
    paranoid: true,
});

Prescription.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id', onDelete: 'CASCADE' });
Prescription.belongsTo(User, { as: 'HealthProfessional', foreignKey: 'health_professional_id', onDelete: 'CASCADE' });

Prescription.sync();

export default Prescription;