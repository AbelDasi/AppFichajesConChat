"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.verificaToken = (req, resp, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.comprobarToken(userToken).then((decoded) => {
        console.log('decoded', decoded);
        req.usuario = decoded.usuario;
        next();
    }).catch(err => {
        resp.json({
            ok: false,
            mensaje: 'Token no valido'
        });
    });
};
/* export const fechaMayor = (req: any, resp: Response, next: NextFunction) => {
    const fecha = req.
} */ 
