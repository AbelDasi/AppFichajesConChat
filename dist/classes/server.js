"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
class Server {
    constructor() {
        this.port = process.env.PUERTO;
        this.app = express_1.default();
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Servidor levantado en el puerto ${this.port}`);
        });
    }
    conectBD() {
        const connect = new sequelize_1.Sequelize('Fichajes', 'abel', 'qwerty', {
            host: 'localhost',
            dialect: 'mssql',
            port: 1433,
            logging: false,
            timezone: "+01:00",
            define: {
                timestamps: false
            },
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 50000
            },
            query: {
                raw: true
            }
        });
        return connect;
    }
}
exports.default = Server;
