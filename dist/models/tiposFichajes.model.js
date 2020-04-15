"use strict";
/* import {Schema, model, Document} from 'mongoose'; */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const server_1 = __importDefault(require("../classes/server"));
const server = new server_1.default();
class TiposFichajes extends sequelize_1.Model {
}
exports.default = TiposFichajes;
TiposFichajes.init({
    Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    Tipo: {
        type: new sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    Remunerado: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    tableName: 'TiposFichaje',
    sequelize: server.conectBD(),
});
