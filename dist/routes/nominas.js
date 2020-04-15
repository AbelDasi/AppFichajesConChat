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
const nominas_model_1 = require("../models/nominas.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const NominasRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
NominasRoutes.post('/CrearNomina', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.Usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesTempNomina(body.Usuario);
    body.Pdf = imagenes;
    nominas_model_1.Nomina.create(body).then((nominaBD) => __awaiter(void 0, void 0, void 0, function* () {
        yield nominaBD.populate('Usuario', '-Password').execPopulate();
        resp.json({
            ok: true,
            nomina: nominaBD
        });
    })).catch(err => {
        resp.json(err);
    });
}));
NominasRoutes.post('/SubirNomina', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.Usuario = req.usuario;
    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    if (!file.mimetype.includes('pdf')) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Solo puede subir archivos pdf'
        });
    }
    if (body.Usuario.permisos !== 'ADMINISTRADOR') {
        return resp.json({
            ok: false,
            mensaje: 'Debes ser el big boss para subir las nominas',
            body
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    resp.json({
        ok: true,
        file: file.mimetype
    });
}));
NominasRoutes.get('/ObtenerNomina/:img', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.Usuario = req.usuario._id;
    const { img } = req.params;
    const pathFoto = fileSystem.getFotoUrl(body.Usuario, img);
    resp.sendFile(pathFoto);
}));
exports.default = NominasRoutes;
