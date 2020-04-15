
import { Model, DataTypes } from "sequelize";
import Server from "../classes/server";
const server = new Server();

export default class Usuarios extends Model {
    Id: any;
    Nombre: any;
    Email: any;
    Password!: string;
    Permisos: any;
    IdEmpresa: any;
    

}
Usuarios.init({
    Id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    Nombre: {
      type: new DataTypes.STRING(200),
      allowNull: false
    },
    Email: {
        type: new DataTypes.STRING(200),
        allowNull: false
      },
    Password: {
      type: new DataTypes.STRING(200),
      allowNull: false
    },
    Permisos: {
      type: new DataTypes.STRING(200),
      allowNull: false
    },
    IdEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'Usuarios',
    sequelize: server.conectBD(), // this bit is important
  });


