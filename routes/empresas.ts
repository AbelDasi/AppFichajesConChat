import { Router, Request, Response } from "express";
import Token from "../classes/token";

import { verificaToken } from "../middlewares/autenticacion";
import Empresa from "../models/empresa.model";

const empresaRouter = Router();

empresaRouter.get('/', verificaToken, async(req: any, resp:Response)=> {
    Empresa.findOne({where : { Id:req.usuario.IdEmpresa}}).then((data) => {
        resp.json({
            ok: true,
            empresa:data
        });
    });
});

// crear empresa 
empresaRouter.post('/create', [verificaToken], async (req: Request, resp:Response)=> {
    console.log(req.body);
    const empresaInsert = await Empresa.create<Empresa>({
        Nombre: req.body.Nombre,
        Direccion: req.body.Direccion
    });
    
    if (empresaInsert) {
        resp.json({
            ok: true,
            empresaInsert
        });
    } else {
        resp.json({
            ok: false
        });
    }
});
// modificar empresa
empresaRouter.post('/update', [verificaToken], (req: any, resp:Response)=> {
    console.log(req.body);
    Empresa.update({Nombre: req.body.Nombre, Direccion : req.body.Direccion}, {where: { Id: req.body.Id }}).then((data) => {
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

empresaRouter.post('/delete', [verificaToken], (req: any, resp:Response)=> {
    console.log(req.body);
    Empresa.destroy({where: { Id: req.body.Id }}).then((data) => {
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

// obtener todas las empresas
empresaRouter.get('/ObtenerTodasLasEmpresas', [verificaToken], async(req: any, resp:Response)=> {
    /*let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;*/
    console.log(req.body);

    Empresa.findAll().then((data) => {
        resp.json({
            ok: true,
            empresas:data
        });
    });
});

export default empresaRouter;