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
const chat_model_1 = __importDefault(require("../models/chat.model"));
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
const ChatRouter = express_1.Router();
ChatRouter.post('/CrearChat', [autenticacion_1.verificaToken], (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const chatInsert = yield chat_model_1.default.create(body);
    if (chatInsert) {
        resp.json({
            ok: true,
            chatInsert,
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
// recoger usuarios y chats a la vez 
ChatRouter.get('/getUsersAndChats', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.usuario);
    let users = [];
    let chats = [];
    usuario_model_1.default.findAll().then((data) => {
        users = data;
        /*Chats.findAll({where: {IdUsuario: req.usuario._id}}).then((data) => {
        chats = data;
        });*/
        console.log(users);
        res.json({
            ok: true,
            usersToChat: users,
            openChats: chats
        });
    });
}));
exports.default = ChatRouter;
