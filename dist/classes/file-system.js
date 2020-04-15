"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            // crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            // nombre archivo
            const nombreArchivo = this.generarNombre(file.name);
            // mover archivo de temp a nuestra carpeta
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombre(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesTempNomina(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathNomina = path_1.default.resolve(__dirname, '../uploads/', userId, 'nominas');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathNomina)) {
            fs_1.default.mkdirSync(pathNomina);
        }
        const imagenesTemp = this.obtenerImagenesTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathNomina}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'nominas', img);
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            console.log('no existe la nomina');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
