import Server from "./classes/server";
import userRouter from "./routes/usuarios";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import FichajeRoutes from "./routes/fichaje";
import fileUpload from 'express-fileupload';
import NominasRoutes from "./routes/nominas";
import AusenciasRoutes from './routes/ausencias';
import TiposFichaje from './routes/tiposFichaje';
import cors from 'cors';
import JornadasRouter from "./routes/jornadas";
import ChatRouter from "./routes/chat";

import http = require('http');
import socketIO = require('socket.io');
import express = require('express');
import path = require('path');
import empresaRouter from "./routes/empresas";

const expressServer = new Server();
const server = http.createServer(expressServer.app);
const io = socketIO.listen(server);

//const server = new Server();

// Body parser 
expressServer.app.use(bodyParser.urlencoded({ extended: true }))
expressServer.app.use(bodyParser.json())
// File Upload
expressServer.app.use(fileUpload())

//configurar cors
expressServer.app.use(cors({ origin: true, credentials: true }));
// rutas y midelwhares
expressServer.app.use('/user', userRouter);
expressServer.app.use('/fichajes', FichajeRoutes);
expressServer.app.use('/nominas', NominasRoutes);
expressServer.app.use('/ausencias', AusenciasRoutes);
expressServer.app.use('/tiposFichaje', TiposFichaje);
expressServer.app.use('/jornadas', JornadasRouter);
expressServer.app.use('/empresas',empresaRouter);
//expressServer.app.use('/chat',ChatRouter);

//Levantar express
expressServer.start();


