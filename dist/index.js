"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const body_parser_1 = __importDefault(require("body-parser"));
const fichaje_1 = __importDefault(require("./routes/fichaje"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const nominas_1 = __importDefault(require("./routes/nominas"));
const ausencias_1 = __importDefault(require("./routes/ausencias"));
const tiposFichaje_1 = __importDefault(require("./routes/tiposFichaje"));
const cors_1 = __importDefault(require("cors"));
const jornadas_1 = __importDefault(require("./routes/jornadas"));
const http = require("http");
const socketIO = require("socket.io");
const empresas_1 = __importDefault(require("./routes/empresas"));
const expressServer = new server_1.default();
const server = http.createServer(expressServer.app);
const io = socketIO.listen(server);
//const server = new Server();
// Body parser 
expressServer.app.use(body_parser_1.default.urlencoded({ extended: true }));
expressServer.app.use(body_parser_1.default.json());
// File Upload
expressServer.app.use(express_fileupload_1.default());
//configurar cors
expressServer.app.use(cors_1.default({ origin: true, credentials: true }));
// rutas y midelwhares
expressServer.app.use('/user', usuarios_1.default);
expressServer.app.use('/fichajes', fichaje_1.default);
expressServer.app.use('/nominas', nominas_1.default);
expressServer.app.use('/ausencias', ausencias_1.default);
expressServer.app.use('/tiposFichaje', tiposFichaje_1.default);
expressServer.app.use('/jornadas', jornadas_1.default);
expressServer.app.use('/empresas', empresas_1.default);
//expressServer.app.use('/chat',ChatRouter);
//Levantar express
expressServer.start();
