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
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const salidas_model_1 = __importDefault(require("../models/salidas.model"));
const utilidades_1 = __importDefault(require("../classes/utilidades"));
const fichaje_model_1 = __importDefault(require("../models/fichaje.model"));
const utiles = new utilidades_1.default();
const SalidasRoutes = express_1.Router();
SalidasRoutes.post('/CrearSalidas', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const salidaInsert = yield salidas_model_1.default.create(body);
    if (salidaInsert) {
        resp.json({
            ok: true,
            salidaInsert,
            mensaje: 'Ausencia creada correctamente'
        });
    }
    else {
        resp.json({
            ok: false,
            mensaje: 'Ha habido un error'
        });
    }
}));
SalidasRoutes.get('/ObtenerSalidas', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        attributes: ['Id', 'Tipo'],
    };
    salidas_model_1.default.findAll(config).then((dataSalidas) => {
        fichaje_model_1.default.findAll({ where: { IdUsuario: req.usuario._id, strFecha: utiles.devolverFecha() }, order: [
                ['Id', 'DESC'],
            ], }).then((dataFichajes) => {
            let dataSalidasSinRealizar = [];
            dataSalidasSinRealizar = dataSalidas.filter(function (salida) {
                let flagReturn = true;
                if (salida.Id != 1) {
                    dataFichajes.forEach(function (fichaje) {
                        if (salida.Id == fichaje.IdTipoFichaje) {
                            flagReturn = false;
                        }
                    });
                }
                if (flagReturn) {
                    return salida;
                }
            });
            res.json({
                ok: true,
                tiposFichajeSinRealizar: dataSalidasSinRealizar,
                userid: req.usuario._id
            });
        });
    });
    /* const salidas = await Salida.find()
                                  .sort({_id: -1})
                                  .populate('Usuario', '-Password')
                                  .exec();
     res.json({
         ok: true,
         salidas
     }) */
}));
//utiles.devolverFecha()
/* SalidasRoutes.get('/ObtenerSalidasDisponibles',[verificaToken], async (req: any, res: Response) => {
    const body = req.body;
    body.Usuario = req.usuario._id;
    const tipos = await Fichaje.find({Fecha:utiles.devolverFecha(),Usuario: body.Usuario},{Tipo:1, _id: 0}, async (err, salidas)=> {
        if (err) throw err;
        const salidasDisp = [];
        if (salidas.length === 0) {
            const salidas = await Salida.find()
                                    .sort({_id: -1})
                                    .populate('Usuario', '-Password')
                                    .exec();
        res.json({
           ok: true,
           salidas
            })
        }
        if (salidas.length > 0) {
            for (let salida of salidas) {
                salidasDisp.push(salida.Tipo);
            }
        }
        const buscarDisponibles = await Salida.find({_id:{$nin:salidasDisp}});

        res.json({
            ok: true,
            salidas: buscarDisponibles
        });
    });
   
});    */
exports.default = SalidasRoutes;
