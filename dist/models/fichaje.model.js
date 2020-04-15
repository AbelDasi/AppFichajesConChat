"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const server_1 = __importDefault(require("../classes/server"));
const server = new server_1.default();
class Fichaje extends sequelize_1.Model {
}
exports.default = Fichaje;
Fichaje.init({
    Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    IdUsuario: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    IdJornada: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    IdEmpresa: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    IdTipoFichaje: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    IdTipoAusencia: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    HoraModificada: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    Ausencia: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    strFecha: {
        type: new sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    Coordenadas: {
        type: new sequelize_1.DataTypes.STRING(250),
        allowNull: false
    },
    Entrada: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    Salida: {
        type: new sequelize_1.DataTypes.STRING
    },
    Fecha: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    HoraEntrada: {
        type: new sequelize_1.DataTypes.STRING(5)
    },
    HoraSalida: {
        type: new sequelize_1.DataTypes.STRING(5)
    },
}, {
    tableName: 'Fichajes',
    sequelize: server.conectBD(),
});
