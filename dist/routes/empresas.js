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
const empresa_model_1 = __importDefault(require("../models/empresa.model"));
const empresaRouter = express_1.Router();
empresaRouter.get('/', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    empresa_model_1.default.findOne({ where: { Id: req.usuario.IdEmpresa } }).then((data) => {
        resp.json({
            ok: true,
            empresa: data
        });
    });
}));
// crear empresa 
empresaRouter.post('/create', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const empresaInsert = yield empresa_model_1.default.create({
        Nombre: req.body.Nombre,
        Direccion: req.body.Direccion
    });
    if (empresaInsert) {
        resp.json({
            ok: true,
            empresaInsert
        });
    }
    else {
        resp.json({
            ok: false
        });
    }
}));
// modificar empresa
empresaRouter.post('/update', [autenticacion_1.verificaToken], (req, resp) => {
    console.log(req.body);
    empresa_model_1.default.update({ Nombre: req.body.Nombre, Direccion: req.body.Direccion }, { where: { Id: req.body.Id } }).then((data) => {
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
});
empresaRouter.post('/delete', [autenticacion_1.verificaToken], (req, resp) => {
    console.log(req.body);
    empresa_model_1.default.destroy({ where: { Id: req.body.Id } }).then((data) => {
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
});
// obtener todas las empresas
empresaRouter.get('/ObtenerTodasLasEmpresas', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    /*let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;*/
    console.log(req.body);
    empresa_model_1.default.findAll().then((data) => {
        resp.json({
            ok: true,
            empresas: data
        });
    });
}));
exports.default = empresaRouter;
