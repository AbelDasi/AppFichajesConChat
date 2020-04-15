import {Request, Response, NextFunction} from 'express';

import Utiles from '../classes/utilidades';
const utiles = new Utiles();
import Jornadas from "../models/jornada.model";

export const verificarJornada = async ( req: any, resp: Response, next: NextFunction) => {
 const jornada = await Jornadas.findOne({where:{'strFecha': req.strFecha, 'IdUsuario': req.usuario._id}});
 if (jornada) {
     next();
 } else {
     resp.json({
         ok: false,
     })
 }
};
/* const mongoose = require('mongoose');

export const verificarHoras = async ( req: any, resp: Response, next: NextFunction) => {
const body = req.body;    
body.Usuario = req.usuario._id;
const buscaFechas = await Fichaje.find({Entrada:{$lt:body.Entrada}}, (err, busqueda) => {
    console.log(busqueda);
    
    if (err) throw err;
    if (busqueda.length > 0) {
        next();
    } else {
        const buscarFichaje =  Fichaje.find({Fecha: utiles.devolverFecha()}, (err, fichaje) => {
            if (fichaje.length === 0) {
                next();
            } else {
                return resp.json({
                    ok: false,
                    mensaje: 'No puedes poner una fecha menor a las que tienes en el registro',
                    busqueda
                });
            }
        });
    }
});
};
export const cierreJornada = async ( req: any, resp: Response, next: NextFunction) => {
    const body = req.body;    
    body.Usuario = req.usuario._id;
    const fichajesConTipo = await Fichaje.aggregate([{
        $match: { "Fecha": utiles.devolverFecha(), Usuario:  mongoose.Types.ObjectId(body.Usuario)}
    },
    {
    $lookup: {
        from: "salidas",
        localField: "Tipo",
        foreignField: "_id",
        as: "salidas"
    }
    },
    { $unwind: "$salidas" }
    ]);

    const finJornada = fichajesConTipo.find(key => key.salidas.Tipo === 'Fin Jornada');
    if (finJornada) {
        return resp.json({
            ok: false,
            mensaje: 'No puedes volver a fichar hoy, se ha cerrado tu jornada laboral',
            fichajesConTipo,
            finJornada
        });
    } else {
        next();
    }
       
}
 */

