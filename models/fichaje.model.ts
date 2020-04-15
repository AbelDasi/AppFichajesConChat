
import { Model, DataTypes, QueryTypes } from "sequelize";
import Server from "../classes/server";
const server = new Server();

export default class Fichaje extends Model {
    Id: any;
    IdUsuario!: number;
    IdJornada!: number;
    IdTipoFichaje!: number;
    IdTipoAusencia!: number;
    IdEmpresa!: number;
    HoraModificada!: boolean;
    Ausencia!: boolean;
    strFecha!: string;
    Entrada!: string;
    Salida!: string;
    Fecha!: Date;
    HoraEntrada!: string;
    HoraSalida!: string;
    Coordenadas!: string;
    duracion: any;

    
}
Fichaje.init({
    Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    IdUsuario: {
        type: new DataTypes.INTEGER(),
    },
    IdJornada: {
        type: new DataTypes.INTEGER(),
    },
    IdEmpresa: {
        type: new DataTypes.INTEGER(),
    },
    IdTipoFichaje: {
        type: new DataTypes.INTEGER(),
    },
    IdTipoAusencia: {
        type: new DataTypes.INTEGER(),
    },
    HoraModificada: {
        type:  DataTypes.BOOLEAN,
    },
    Ausencia: {
        type:  DataTypes.BOOLEAN,
    },
    strFecha: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    Coordenadas: {
        type: new DataTypes.STRING(250),
        allowNull: false
    },
    Entrada: {
        type: new DataTypes.STRING,
        allowNull: false
    },
    Salida: {
        type: new DataTypes.STRING
    },
    Fecha: {
        type: new DataTypes.STRING,
        allowNull: false
    },
    HoraEntrada: {
        type: new DataTypes.STRING(5)
    },
    HoraSalida: {
        type: new DataTypes.STRING(5)
    },
  },
  {
    tableName: 'Fichajes',
    sequelize: server.conectBD(), // this bit is important
  });