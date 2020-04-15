import express from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';


dotenv.config()
export default class Server {
    public app: express.Application;
    public port: any = process.env.PUERTO;


    constructor() {
        this.app = express();


    }
    start() {
        this.app.listen(this.port, ()=> {
            console.log(`Servidor levantado en el puerto ${this.port}`);
            
        });
    }
    conectBD() {
        const connect = new Sequelize('Fichajes', 'abel', 'qwerty', {
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
            query:{
                raw: true
            }
        }); 
        return connect;
    }
    
}