import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

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
    email: {
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
    dob: {
        type: DataTypes.DATEONLY, // Apenas data, sem tempo
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Patient', 'HealthProfessional', 'Admin'),
        allowNull: false,
        defaultValue: 'Patient'
    }
}, {
    tableName: 'User',
});

User.prototype.login = function() {
    console.log(`[User] ${this.username} logou.`);
    return true;
};

export default User;
