import { Router, Request, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import Jornadas from "../models/jornada.model";
import Utiles from "../classes/utilidades";
const utiles = new Utiles();
const JornadasRouter = Router();

JornadasRouter.get('/ObtenerJornadaActual', verificaToken, async(req: any, resp:Response)=> {
    
    Jornadas.findAll({where: {IdUsuario: req.usuario._id, strFecha:utiles.devolverFecha()},order: [
        ['Id', 'DESC'],
    ],}).then((data) => {
        resp.json({
            ok: true,
            jornadaActual:data
        });
    });
});

JornadasRouter.get('/ObtenerJornadas', verificaToken, async(req: any, resp:Response)=> {
    let user = Number(req.query.IdUsuario) || null;
    console.log(user);
    
    const config = {
        attributes: ['Id', 'Nombre', 'Email', 'Permisos'],
    }
    if (!user) {
        Jornadas.findAll({where: {IdUsuario: req.usuario._id},order: [
            ['Id', 'DESC'],
        ],}).then((data) => {
            resp.json({
                ok: true,
                jornadas:data
            });
        });
    } else {
        if (req.usuario.Permisos === 'admin') {
            Jornadas.findAll().then((data) => {
                resp.json({
                    ok: true,
                    jornadas:data
                });
            });
        } else {
            resp.json({
            ok: false,
            mensaje: 'No tienes permisos de Admin',
            usuario: req.usuario});
        }
    }
});

JornadasRouter.get('/ObtenerJornadaAnterior', verificaToken, async(req: any, resp:Response) =>{
    const fecha = req.query.fecha;
    
});

JornadasRouter.post('/ModificarJornada', verificaToken, async(req: any, resp:Response)=> {
    const body = req.body;
    Jornadas.update(body, {where: { Id: req.body.Id }}).then((data) => {
        if (data) {
            resp.json({
                ok: true,
                data
            });
        } else {
            resp.json({
                ok: false
            });
        }
    }); 
});

JornadasRouter.post('/BorrarJornada', verificaToken, async(req: any, resp:Response)=> {
    Jornadas.destroy({where: { Id: req.body.Id }}).then((data) => {
        if (data) {
            resp.json({
                ok: true,
                data
            });
        } else {
            resp.json({
                ok: false
            });
        }
    }); 
});

JornadasRouter.post('/BorrarTodasLasJornadasDeUnUsuario', verificaToken, async(req: any, resp:Response)=> {
    Jornadas.destroy({where: { IdUsuario: req.usuario._id }}).then((data) => {
        if (data) {
            resp.json({
                ok: true,
                data
            });
        } else {
            resp.json({
                ok: false
            });
        }
    }); 
});

export default JornadasRouter;