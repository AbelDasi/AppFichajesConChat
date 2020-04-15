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
const utilidades_1 = __importDefault(require("../classes/utilidades"));
const fichaje_model_1 = __importDefault(require("../models/fichaje.model"));
const utiles = new utilidades_1.default();
const TiposFichaje = express_1.Router();
TiposFichaje.post('/CrearTipoDeFichaje', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const salidaInsert = yield TiposFichaje.create(body);
    if (salidaInsert) {
        resp.json({
            ok: true,
            salidaInsert,
            mensaje: 'Tipo de fichaje creado correctamente'
        });
    }
    else {
        resp.json({
            ok: false,
            mensaje: 'Ha habido un error'
        });
    }
}));
TiposFichaje.get('/ObtenerTiposDeFichaje', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        attributes: ['Id', 'Tipo'],
    };
    TiposFichaje.findAll(config).then((dataTiposFichaje) => {
        fichaje_model_1.default.findAll({ where: { IdUsuario: req.usuario._id, strFecha: utiles.devolverFecha() }, order: [
                ['Id', 'DESC'],
            ], }).then((dataFichajes) => {
            let dataTiposFichajeSinRealizar = [];
            dataTiposFichajeSinRealizar = dataTiposFichaje.filter(function (tipoFichaje) {
                let flagReturn = true;
                dataFichajes.forEach(function (fichaje) {
                    if (tipoFichaje.Id == fichaje.IdTipoFichaje) {
                        flagReturn = false;
                    }
                });
                if (flagReturn) {
                    return tipoFichaje;
                }
            });
            res.json({
                ok: true,
                tiposFichajeSinRealizar: dataTiposFichajeSinRealizar,
                userid: req.usuario._id
            });
        });
    });
}));
exports.default = TiposFichaje;
