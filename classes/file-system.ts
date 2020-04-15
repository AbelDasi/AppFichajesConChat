import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
import { json } from "body-parser";

export default class FileSystem {
    constructor() {}
    guardarImagenTemporal(file: FileUpload, userId: string) {


        return new Promise((resolve, reject) => {
             // crear carpetas
            const path = this.crearCarpetaUsuario(userId);

            // nombre archivo
            const nombreArchivo = this.generarNombre(file.name);
         
            // mover archivo de temp a nuestra carpeta
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
       
        

    }
    private generarNombre(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid();

        return `${idUnico}.${extension}`
    }
    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
        
    }
    imagenesTempNomina(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathNomina = path.resolve(__dirname, '../uploads/', userId, 'nominas');
        if (!fs.existsSync(pathTemp)) {
            return [];
        } 
        if (!fs.existsSync(pathNomina)) {
            fs.mkdirSync(pathNomina);
        }
        const imagenesTemp = this.obtenerImagenesTemp(userId);
        imagenesTemp.forEach(imagen=> {
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathNomina}/${imagen}`)
        });
        return imagenesTemp;
    }
    private obtenerImagenesTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId: string, img: string) {
        
        const pathFoto = path.resolve(__dirname, '../uploads/', userId, 'nominas', img);
        const existe = fs.existsSync(pathFoto);
        if (!existe) {
            console.log('no existe la nomina');
        }
        return pathFoto;
    }
}