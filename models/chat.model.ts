
import { Model, DataTypes, QueryTypes } from "sequelize";
import Server from "../classes/server";
const server = new Server();

export default class Chat extends Model {
    Id: any;
    IdChat!: number;
    IdUsuario!: number;
    IdUsuarioDestinatario!: number;
    FechaUltimoMensaje!: string;
}

Chat.init({
    Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    IdChat: {
        type: new DataTypes.INTEGER(),
    },
    IdUsuario: {
        type: new DataTypes.INTEGER(),
    },
    IdUsuarioDestinatario: {
        type: new DataTypes.INTEGER(),
    },
    FechaUltimoMensaje: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
  },
  {
    tableName: 'Chats',
    sequelize: server.conectBD(), // this bit is important
  });