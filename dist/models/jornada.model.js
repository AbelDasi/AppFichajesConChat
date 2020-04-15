"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const server_1 = __importDefault(require("../classes/server"));
const server = new server_1.default();
class Jornadas extends sequelize_1.Model {
}
exports.default = Jornadas;
Jornadas.init({
    Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    IdUsuario: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    IdEmpresa: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    InicioJornada: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    FinJornada: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    NumeroFichajes: {
        type: new sequelize_1.DataTypes.INTEGER,
    },
    strFecha: {
        type: new sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
}, {
    tableName: 'Jornadas',
    sequelize: server.conectBD(),
});
