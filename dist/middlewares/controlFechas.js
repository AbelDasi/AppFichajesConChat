"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilidades_1 = __importDefault(require("../classes/utilidades"));
const utiles = new utilidades_1.default();
const jornada_model_1 = __importDefault(require("../models/jornada.model"));
exports.verificarJornada = (req, resp, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jornada = yield jornada_model_1.default.findOne({ where: { 'strFecha': req.strFecha, 'IdUsuario': req.usuario._id } });
    if (jornada) {
        next();
    }
    else {
        resp.json({
            ok: false,
        });
    }
});
/* const mongoose = require('mongoose');

export const verificarHoras = async ( req: any, resp: Response, next: NextFunction) => {
const body = req.body;
body.Usuario = req.usuario._id;
const buscaFechas = await Fichaje.find({Entrada:{$lt:body.Entrada}}, (err, busqueda) => {
    console.log(busqueda);
    
    if (err) throw err;
    if (busqueda.length > 0) {
        next();
    } else {
        const buscarFichaje =  Fichaje.find({Fecha: utiles.devolverFecha()}, (err, fichaje) => {
            if (fichaje.length === 0) {
                next();
            } else {
                return resp.json({
                    ok: false,
                    mensaje: 'No puedes poner una fecha menor a las que tienes en el registro',
                    busqueda
                });
            }
        });
    }
});
};
export const cierreJornada = async ( req: any, resp: Response, next: NextFunction) => {
    const body = req.body;
    body.Usuario = req.usuario._id;
    const fichajesConTipo = await Fichaje.aggregate([{
        $match: { "Fecha": utiles.devolverFecha(), Usuario:  mongoose.Types.ObjectId(body.Usuario)}
    },
    {
    $lookup: {
        from: "salidas",
        localField: "Tipo",
        foreignField: "_id",
        as: "salidas"
    }
    },
    { $unwind: "$salidas" }
    ]);

    const finJornada = fichajesConTipo.find(key => key.salidas.Tipo === 'Fin Jornada');
    if (finJornada) {
        return resp.json({
            ok: false,
            mensaje: 'No puedes volver a fichar hoy, se ha cerrado tu jornada laboral',
            fichajesConTipo,
            finJornada
        });
    } else {
        next();
    }
       
}
 */
