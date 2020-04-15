
import { Model, DataTypes } from "sequelize";
import Server from "../classes/server";
const server = new Server();

export default class Jornadas extends Model {
    Id: any;
    IdUsuario!: number;
    InicioJornada!: boolean;
    FinJornada!: boolean;
    NumeroFichajes!: number;
    strFecha!: string; 
}
Jornadas.init({
    Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    IdUsuario: {
        type: new DataTypes.INTEGER(),
    },
    IdEmpresa: {
        type: new DataTypes.INTEGER(),
    },
    InicioJornada: {
        type:  DataTypes.BOOLEAN,
    },
    FinJornada: {
        type: DataTypes.BOOLEAN,
    },
    NumeroFichajes: {
        type: new DataTypes.INTEGER,
    },
    strFecha: {
        type: new DataTypes.STRING(20),
        allowNull: false
    },
    
  },
  {
    tableName: 'Jornadas',
    sequelize: server.conectBD(), // this bit is important
  });


