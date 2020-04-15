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
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const userRouter = express_1.Router();
// login
userRouter.post('/login', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = yield usuario_model_1.default.findOne({ where: { Email: body.Email, Password: body.Password } });
    if (!user) {
        return resp.json({
            ok: false,
            mensaje: 'El usuario o contraseña no son correctos'
        });
    }
    const tokenUsuario = token_1.default.getJwtToken({
        _id: user.Id,
        Nombre: user.Nombre,
        Email: user.Email,
        Permisos: user.Permisos,
        IdEmpresa: user.IdEmpresa
    });
    resp.json({
        ok: true,
        token: tokenUsuario
    });
}));
// crear usuario 
userRouter.post('/create', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const userInsert = yield usuario_model_1.default.create({
        Nombre: req.body.Nombre,
        Email: req.body.Email,
        Password: req.body.Password,
        Permisos: req.body.Permisos
    });
    if (userInsert) {
        resp.json({
            ok: true,
            userInsert
        });
    }
    else {
        resp.json({
            ok: false
        });
    }
}));
// modificar usuario
userRouter.post('/update', autenticacion_1.verificaToken, (req, resp) => {
    usuario_model_1.default.update({ Nombre: req.body.Nombre }, { where: { Id: req.usuario._id } }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data) {
            const user = yield usuario_model_1.default.findOne({ where: { Id: req.usuario._id } });
            const tokenUsuario = token_1.default.getJwtToken({
                _id: user === null || user === void 0 ? void 0 : user.Id,
                Nombre: user === null || user === void 0 ? void 0 : user.Nombre,
                Email: user === null || user === void 0 ? void 0 : user.Email,
                Permisos: user === null || user === void 0 ? void 0 : user.Permisos,
                IdEmpresa: user === null || user === void 0 ? void 0 : user.IdEmpresa
            });
            resp.json({
                ok: true,
                data,
                token: tokenUsuario
            });
        }
        else {
            resp.json({
                ok: false
            });
        }
    }));
});
userRouter.post('/delete', autenticacion_1.verificaToken, (req, resp) => {
    usuario_model_1.default.destroy({ where: { Id: req.usuario._id } }).then((data) => {
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
// obtener todos los usuarios 
userRouter.get('/ObtenerUsuarios', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const config = {
        attributes: ['Id', 'Nombre', 'Email', 'Permisos'],
    };
    usuario_model_1.default.findAll(config).then((data) => {
        resp.json({
            ok: true,
            usuarios: data
        });
    });
}));
userRouter.get('/', autenticacion_1.verificaToken, (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.usuario;
    resp.json({
        ok: true,
        usuario
    });
}));
exports.default = userRouter;
