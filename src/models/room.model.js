import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('AppointmentRoom', 'Hospitalization'),
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'Room',
});

export default Room;
