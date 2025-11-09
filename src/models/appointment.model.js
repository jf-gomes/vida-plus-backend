import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // ID do paciente ao qual o appointment se refere
    patient: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // ID do profissional ao qual o appointment se refere
    healthProfessional: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    online: { // Appointment online?
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    // ID do quarto no qual o appointment acontecerá
    room: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'Appointment',
});

export default Appointment;
