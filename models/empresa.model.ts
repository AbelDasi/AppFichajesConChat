
import { Model, DataTypes } from "sequelize";
import Server from "../classes/server";
const server = new Server();

export default class Empresa extends Model {
    Id: any;
    Nombre: any;
    Direccion!: string;

}
Empresa.init({
    Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    Nombre: {
      type: new DataTypes.STRING(200),
      allowNull: false
    },
    Direccion: {
      type: new DataTypes.STRING(200),
      allowNull: false
    }
  },
  {
    tableName: 'Empresas',
    sequelize: server.conectBD(), // this bit is important
  });


