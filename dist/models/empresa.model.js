"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const server_1 = __importDefault(require("../classes/server"));
const server = new server_1.default();
class Empresa extends sequelize_1.Model {
}
exports.default = Empresa;
Empresa.init({
    Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    Nombre: {
        type: new sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    Direccion: {
        type: new sequelize_1.DataTypes.STRING(200),
        allowNull: false
    }
}, {
    tableName: 'Empresas',
    sequelize: server.conectBD(),
});
