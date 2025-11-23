import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';
import User from './user.model.js';

const Appointment = sequelize.define('Appointment', {
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
    date: {
        type: DataTypes.DATE,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    room: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'Appointment',
    paranoid: true,
});

Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { as: 'HealthProfessional', foreignKey: 'health_professional_id', onDelete: 'CASCADE' });

Appointment.sync();

export default Appointment;