"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const server_1 = __importDefault(require("../classes/server"));
const server = new server_1.default();
class Chat extends sequelize_1.Model {
}
exports.default = Chat;
Chat.init({
    Id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    IdChat: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    IdUsuario: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    IdUsuarioDestinatario: {
        type: new sequelize_1.DataTypes.INTEGER(),
    },
    FechaUltimoMensaje: {
        type: new sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
}, {
    tableName: 'Chats',
    sequelize: server.conectBD(),
});
