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
const jornada_model_1 = __importDefault(require("../models/jornada.model"));
const utilidades_1 = __importDefault(require("../classes/utilidades"));
const utiles = new utilidades_1.default();
const JornadasRouter = express_1.Router();
JornadasRouter.get('/ObtenerJornadaActual', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    jornada_model_1.default.findAll({ where: { IdUsuario: req.usuario._id, strFecha: utiles.devolverFecha() }, order: [
            ['Id', 'DESC'],
        ], }).then((data) => {
        resp.json({
            ok: true,
            jornadaActual: data
        });
    });
}));
JornadasRouter.get('/ObtenerJornadas', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let user = Number(req.query.IdUsuario) || null;
    console.log(user);
    const config = {
        attributes: ['Id', 'Nombre', 'Email', 'Permisos'],
    };
    if (!user) {
        jornada_model_1.default.findAll({ where: { IdUsuario: req.usuario._id }, order: [
                ['Id', 'DESC'],
            ], }).then((data) => {
            resp.json({
                ok: true,
                jornadas: data
            });
        });
    }
    else {
        if (req.usuario.Permisos === 'admin') {
            jornada_model_1.default.findAll().then((data) => {
                resp.json({
                    ok: true,
                    jornadas: data
                });
            });
        }
        else {
            resp.json({
                ok: false,
                mensaje: 'No tienes permisos de Admin',
                usuario: req.usuario
            });
        }
    }
}));
JornadasRouter.get('/ObtenerJornadaAnterior', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const fecha = req.query.fecha;
}));
JornadasRouter.post('/ModificarJornada', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    jornada_model_1.default.update(body, { where: { Id: req.body.Id } }).then((data) => {
        if (data) {
            resp.json({
                ok: true,
                data
            });
        }
        else {
            resp.json({
                ok: false
            });
        }
    });
}));
JornadasRouter.post('/BorrarJornada', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    jornada_model_1.default.destroy({ where: { Id: req.body.Id } }).then((data) => {
        if (data) {
            resp.json({
                ok: true,
                data
            });
        }
        else {
            resp.json({
                ok: false
            });
        }
    });
}));
JornadasRouter.post('/BorrarTodasLasJornadasDeUnUsuario', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    jornada_model_1.default.destroy({ where: { IdUsuario: req.usuario._id } }).then((data) => {
        if (data) {
            resp.json({
                ok: true,
                data
            });
        }
        else {
            resp.json({
                ok: false
            });
        }
    });
}));
exports.default = JornadasRouter;
