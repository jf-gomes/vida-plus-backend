import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection.js';

const Supply = sequelize.define('Supply', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Aqui será armazenado o código o produto
    code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'Supply',
});

export default Supply;
