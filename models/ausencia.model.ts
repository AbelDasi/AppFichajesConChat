
import { Model, DataTypes } from "sequelize";
import Server from "../classes/server";
const server = new Server();

export default class Ausencias extends Model {
    Id: any;
    Tipo!: string;
}
Ausencias.init({
    Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    Tipo: {
      type: new DataTypes.STRING(200),
      allowNull: false
    }
  },
  {
    tableName: 'Ausencias',
    sequelize: server.conectBD(), // this bit is important
  });
