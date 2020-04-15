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
const ausencia_model_1 = __importDefault(require("../models/ausencia.model"));
const AusenciasRoutes = express_1.Router();
AusenciasRoutes.post('/CrearAusencia', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const ausenciaInsert = yield ausencia_model_1.default.create(body);
    if (ausenciaInsert) {
        resp.json({
            ok: true,
            ausenciaInsert,
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
// recoger ausencias 
AusenciasRoutes.get('/ObtenerAusencias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        attributes: ['Id', 'Tipo'],
    };
    ausencia_model_1.default.findAll(config).then((data) => {
        res.json({
            ok: true,
            ausencias: data
        });
    });
}));
exports.default = AusenciasRoutes;
