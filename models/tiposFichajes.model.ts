/* import {Schema, model, Document} from 'mongoose'; */

import { Model, DataTypes } from "sequelize";
import Server from "../classes/server";
const server = new Server();
export default class TiposFichajes extends Model {
    Id: any;
    Tipo!: string;
    Remunerado!: boolean;
}
TiposFichajes.init({
    Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    Tipo: {
      type: new DataTypes.STRING(200),
      allowNull: false
    },
    Remunerado: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: 'TiposFichaje',
    sequelize: server.conectBD(), // this bit is important
  });

