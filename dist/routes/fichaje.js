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
const fichaje_model_1 = __importDefault(require("../models/fichaje.model"));
const jornada_model_1 = __importDefault(require("../models/jornada.model"));
const utilidades_1 = __importDefault(require("../classes/utilidades"));
const sequelize_1 = require("sequelize");
const utiles = new utilidades_1.default();
const FichajeRoutes = express_1.Router();
FichajeRoutes.post('/', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    jornada_model_1.default.findOne({ where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornadaExist => {
        if (!jornadaExist) {
            jornada_model_1.default.create({
                IdUsuario: req.usuario._id,
                IdEmpresa: req.usuario.IdEmpresa,
                InicioJornada: true,
                FinJornada: false,
                NumeroFichajes: 1,
                strFecha: body.strFecha
            }).then(data => {
                console.log(data);
                if (!data) {
                    return resp.json({
                        ok: false,
                        mensaje: 'No se puede crear el fichaje, intentelo mas tarde 1'
                    });
                }
                else {
                    body.IdJornada = data.Id;
                    body.IdUsuario = data.IdUsuario;
                    body.IdEmpresa = req.usuario.IdEmpresa;
                    body.Entrada = new Date(Date.now()).toISOString();
                    body.Fecha = new Date(Date.now()).toISOString();
                    fichaje_model_1.default.create(body).then(data1 => {
                        if (!data1) {
                            return resp.json({
                                ok: false,
                                mensaje: 'No se ha podido crear el fichaje 2'
                            });
                        }
                        resp.json({
                            ok: true,
                            fichaje: data1
                        });
                    }, err => {
                        if (err) {
                            jornada_model_1.default.findOne({ where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornada => {
                                if (jornada) {
                                    jornada_model_1.default.destroy({ where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } });
                                    resp.json({
                                        ok: false,
                                        mensaje: 'No se ha podido crear el fichaje 3',
                                        err: err
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            jornada_model_1.default.findOne({
                where: { strFecha: body.strFecha, IdUsuario: req.usuario._id }, order: [
                    ['Id', 'DESC']
                ]
            }).then(jornada => {
                if (jornada) {
                    body.Entrada = new Date(Date.now()).toISOString();
                    body.Fecha = new Date(Date.now()).toISOString();
                    body.IdEmpresa = req.usuario.IdEmpresa;
                    fichaje_model_1.default.findAll({
                        where: { strFecha: body.strFecha, IdUsuario: req.usuario._id }, order: [
                            ['Id', 'DESC']
                        ]
                    }).then(fichaje => {
                        if (fichaje) {
                            //  console.log(`UPDATE Fichajes SET Salida ='${body.Entrada}' where Id = ${fichaje[0].Id}`);
                            fichaje_model_1.default.update({ Salida: body.Entrada }, { where: { Id: fichaje[0].Id } }).then(fichaje => {
                                if (!fichaje) {
                                    return;
                                }
                                if (body.IdTipoFichaje == 3) {
                                    body.Salida = body.Entrada;
                                }
                                body.IdJornada = jornada.Id;
                                body.IdUsuario = jornada.IdUsuario;
                                body.Entrada = new Date(Date.now()).toISOString();
                                body.Fecha = new Date(Date.now()).toISOString();
                                fichaje_model_1.default.create(body).then(data1 => {
                                    if (!data1) {
                                        return resp.json({
                                            ok: false,
                                            mensaje: 'No se ha podido crear el fichaje 4'
                                        });
                                    }
                                    // Detectar fin de jornada
                                    if (data1.IdTipoFichaje == 3) {
                                        jornada_model_1.default.update({ NumeroFichajes: jornada.NumeroFichajes + 1, FinJornada: 1 }, { where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornadaMod => {
                                            if (!jornadaMod) {
                                                return;
                                            }
                                            resp.json({
                                                ok: true,
                                                fichaje: data1
                                            });
                                        });
                                    }
                                    else {
                                        jornada_model_1.default.update({ NumeroFichajes: jornada.NumeroFichajes + 1 }, { where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornadaMod => {
                                            if (!jornadaMod) {
                                                return;
                                            }
                                            resp.json({
                                                ok: true,
                                                fichaje: data1
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
}));
FichajeRoutes.post('/BorrarFichaje', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    fichaje_model_1.default.destroy({ where: { Id: req.body.Id } }).then(data => {
        resp.json({
            ok: true,
            data: data
        });
    });
}));
FichajeRoutes.post('/BorrarTodosLosFichajesDeUnaJornada', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    fichaje_model_1.default.destroy({ where: { IdJornada: req.body.IdJornada } }).then(data => {
        resp.json({
            ok: true,
            data: data
        });
    });
}));
FichajeRoutes.get('/ObtenerFichajes', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let fecha;
    let query;
    let horas = 0;
    let mins = 0;
    let segs = 0;
    if (req.query.tiempoTrabajado == "true") {
        fecha = utiles.devolverFecha();
        query = `SELECT f.*,tf.Tipo
        FROM Fichajes f
        INNER JOIN TiposFichaje tf
        ON f.IdTipoFichaje = tf.Id where f.strFecha = '${fecha}' and f.IdUsuario=${req.usuario._id} and tf.Remunerado = 1;`;
    }
    else {
        let fecha = req.query.fecha || utiles.devolverFecha();
        query = `SELECT f.*,tf.Tipo
        FROM Fichajes f
        INNER JOIN TiposFichaje tf
        ON f.IdTipoFichaje = tf.Id where f.strFecha = '${fecha}' and f.IdUsuario=${req.usuario._id};`;
    }
    (_a = fichaje_model_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(query, { type: sequelize_1.QueryTypes.SELECT, raw: true }).then((fichajes) => {
        if (!fichajes) {
            return resp.json({
                ok: false,
                mensaje: 'Este usuario no tiene fichajes'
            });
        }
        let entrada;
        let salida;
        if (req.query.tiempoTrabajado == "true") {
            for (const { item, index } of fichajes.map((item, index) => ({ item, index }))) {
                if (item.Salida !== null) {
                    entrada = new Date(item.Entrada);
                    salida = new Date(item.Salida);
                    console.log("Entrada: " + entrada + " | Salida: " + salida);
                    let diffSegs = (entrada.getTime() - salida.getTime()) / 1000;
                    console.log(Math.abs(Math.trunc(diffSegs % 60)));
                    segs += Math.abs(Math.trunc(diffSegs % 60));
                    console.log("segs: " + segs);
                    console.log(Math.abs(Math.trunc(diffSegs / 60)));
                    mins += Math.abs(Math.trunc(diffSegs / 60));
                    console.log("mins: " + mins);
                    console.log(Math.abs(Math.trunc(diffSegs / 3600)));
                    horas += Math.abs(Math.trunc(diffSegs / 3600));
                    console.log("horas: " + horas);
                    console.log(horas + ":" + mins + ":" + segs);
                }
            }
            if (segs > 59) {
                mins = Math.trunc(segs / 60) + mins;
                segs = segs % 60;
            }
            ;
            if (mins > 59) {
                horas = Math.trunc(mins / 60);
                mins = mins % 60;
            }
            ;
            console.log(horas + ":" + mins + ":" + segs);
            resp.json({
                ok: true,
                fichajes: fichajes,
                horas: horas,
                mins: mins,
                segs: segs
            });
        }
        else {
            for (const { item, index } of fichajes.map((item, index) => ({ item, index }))) {
                entrada = new Date(item.Entrada);
                salida = new Date(item.Salida);
                console.log("Entrada: " + entrada + " | Salida: " + salida);
                let diff = (entrada.getTime() - salida.getTime()) / 1000;
                item.segs = Math.abs(Math.trunc(diff));
                diff /= 60;
                item.mins = Math.abs(Math.trunc(diff));
                item.segs = Math.abs(Math.trunc(item.segs - item.mins * 60));
                diff /= 60;
                item.horas = Math.abs(Math.trunc(diff));
                item.mins = Math.abs(Math.trunc(item.mins - item.horas * 60));
                console.log("item.horas: " + item.horas + " | item.minutos: " + item.mins + " | item.segs: " + item.segs);
            }
            resp.json({
                ok: true,
                fichajes: fichajes
            });
        }
    });
}));
exports.default = FichajeRoutes;
