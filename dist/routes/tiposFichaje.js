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
const tiposFichajes_model_1 = __importDefault(require("../models/tiposFichajes.model"));
const utilidades_1 = __importDefault(require("../classes/utilidades"));
const fichaje_model_1 = __importDefault(require("../models/fichaje.model"));
const sequelize_1 = require("sequelize");
const utiles = new utilidades_1.default();
const TiposFichaje = express_1.Router();
TiposFichaje.post('/CrearTipoDeFichaje', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const salidaInsert = yield tiposFichajes_model_1.default.create(body);
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
TiposFichaje.post('/BorrarTipoDeFichaje', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    tiposFichajes_model_1.default.destroy({ where: { Id: req.body.Id } }).then(data => {
        resp.json({
            ok: true,
            data: data
        });
    });
}));
TiposFichaje.get('/ObtenerTiposDeFichajeDisponibles', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (_a = fichaje_model_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(`select tpf.Id, tpf.Remunerado,f.Entrada from TiposFichaje tpf 
    inner join Fichajes f on f.IdTipoFichaje = tpf.Id 
    where f.IdUsuario = '${req.usuario._id}'
    AND f.strFecha = '${utiles.devolverFecha()}';`, { type: sequelize_1.QueryTypes.SELECT }).then((fichajesUsuario) => {
        let ultimoFichaje = fichajesUsuario[fichajesUsuario.length - 1];
        if (fichajesUsuario.length > 0) {
            tiposFichajes_model_1.default.findAll({ where: { Remunerado: !ultimoFichaje.Remunerado } }).then(tiposFichaje => {
                let tiposFichajeSinRealizar = tiposFichaje.filter(function (tipofichaje) {
                    let flagReturn = true;
                    fichajesUsuario.forEach(function (fichajeUsuario) {
                        if (tipofichaje.Id == fichajeUsuario.Id) {
                            flagReturn = false;
                        }
                    });
                    if (flagReturn)
                        return true;
                    else
                        return false;
                });
                res.json({
                    ok: true,
                    tiposFichajeDisponibles: tiposFichajeSinRealizar,
                    fichajesUsuario: fichajesUsuario,
                    ultimoFichaje: ultimoFichaje
                });
            });
        }
        else {
            tiposFichajes_model_1.default.findAll().then(tiposFichaje => {
                res.json({
                    ok: true,
                    tiposFichajeDisponibles: tiposFichaje,
                    ultimoFichaje: { Remunerado: false }
                });
            });
        }
    });
}));
exports.default = TiposFichaje;
