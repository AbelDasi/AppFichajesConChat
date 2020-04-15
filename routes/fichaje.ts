import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import Fichaje from '../models/fichaje.model';
import Jornadas from "../models/jornada.model";
import Utiles from "../classes/utilidades";
import { QueryTypes } from "sequelize";
import bodyParser = require("body-parser");
const utiles = new Utiles();


const FichajeRoutes = Router();

FichajeRoutes.post('/', [verificaToken], async (req: any, resp: Response) => {
    const body = req.body;
    
    Jornadas.findOne({ where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornadaExist => {
        if (!jornadaExist) {
            Jornadas.create<Jornadas>({
                IdUsuario: req.usuario._id,
                IdEmpresa: req.usuario.IdEmpresa,
                InicioJornada: true,
                FinJornada: false,
                NumeroFichajes: 1,
                strFecha: body.strFecha
            }).then(data => {
                console.log(data);
                
                if (!data) {
                    return resp.json({
                        ok: false,
                        mensaje: 'No se puede crear el fichaje, intentelo mas tarde 1'
                    });
                } else {
                    body.IdJornada = data.Id;
                    body.IdUsuario = data.IdUsuario;
                    body.IdEmpresa = req.usuario.IdEmpresa;
                    body.Entrada = new Date(Date.now()).toISOString();
                    body.Fecha = new Date(Date.now()).toISOString();
                    Fichaje.create<Fichaje>(body).then(data1 => {
                        if (!data1) {
                            return resp.json({
                                ok: false,
                                mensaje: 'No se ha podido crear el fichaje 2'
                            });
                        }
                        resp.json({
                            ok: true,
                            fichaje: data1
                        });
                    }, err => {
                        if (err) {
                            Jornadas.findOne({ where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornada => {
                                if (jornada) {
                                    Jornadas.destroy({ where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } });
                                    resp.json({
                                        ok: false,
                                        mensaje: 'No se ha podido crear el fichaje 3',
                                        err: err
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            Jornadas.findOne({
                where: { strFecha: body.strFecha, IdUsuario: req.usuario._id }, order: [
                    ['Id', 'DESC']
                ]
            }).then(jornada => {
                if (jornada) {
                    body.Entrada = new Date(Date.now()).toISOString();
                    body.Fecha = new Date(Date.now()).toISOString();
                    body.IdEmpresa = req.usuario.IdEmpresa;
                    Fichaje.findAll({
                        where: { strFecha: body.strFecha, IdUsuario: req.usuario._id }, order: [
                            ['Id', 'DESC']
                        ]
                    }).then(fichaje => {
                        if (fichaje) {
                            //  console.log(`UPDATE Fichajes SET Salida ='${body.Entrada}' where Id = ${fichaje[0].Id}`);
                            Fichaje.update({ Salida: body.Entrada }, { where: { Id: fichaje[0].Id } }).then(fichaje => {
                                if (!fichaje) {
                                    return;
                                }

                                if(body.IdTipoFichaje==3){
                                    body.Salida = body.Entrada
                                }

                                body.IdJornada = jornada.Id;
                                body.IdUsuario = jornada.IdUsuario;
                                body.Entrada = new Date(Date.now()).toISOString();
                                body.Fecha = new Date(Date.now()).toISOString();
                                Fichaje.create<Fichaje>(body).then(data1 => {
                                    if (!data1) {
                                        return resp.json({
                                            ok: false,
                                            mensaje: 'No se ha podido crear el fichaje 4'
                                        });
                                    }

                                    // Detectar fin de jornada

                                    if(data1.IdTipoFichaje==3){
                                        Jornadas.update({ NumeroFichajes: jornada.NumeroFichajes + 1, FinJornada:1 }, { where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornadaMod => {
                                            if (!jornadaMod) {
                                                return;
                                            }
                                            resp.json({
                                                ok: true,
                                                fichaje: data1
                                            });
                                        });
                                    }else{
                                        Jornadas.update({ NumeroFichajes: jornada.NumeroFichajes + 1 }, { where: { strFecha: body.strFecha, IdUsuario: req.usuario._id } }).then(jornadaMod => {
                                            if (!jornadaMod) {
                                                return;
                                            }
                                            resp.json({
                                                ok: true,
                                                fichaje: data1
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});

FichajeRoutes.post('/BorrarFichaje', [verificaToken], async (req: any, resp: Response) => {
    Fichaje.destroy({where : { Id:req.body.Id}}).then(data => {
        resp.json({
            ok:true,
            data:data
        })
    })
})

FichajeRoutes.post('/BorrarTodosLosFichajesDeUnaJornada', [verificaToken], async (req: any, resp: Response) => {
    Fichaje.destroy({where : { IdJornada:req.body.IdJornada}}).then(data => {
        resp.json({
            ok:true,
            data:data
        })
    })
})

FichajeRoutes.get('/ObtenerFichajes', [verificaToken], async (req: any, resp: Response) => {

    let fecha;
    let query:string;
    let horas:number=0;
    let mins:number=0;
    let segs:number=0;
    
    if(req.query.tiempoTrabajado=="true"){
        fecha = utiles.devolverFecha();
        query = `SELECT f.*,tf.Tipo
        FROM Fichajes f
        INNER JOIN TiposFichaje tf
        ON f.IdTipoFichaje = tf.Id where f.strFecha = '${fecha}' and f.IdUsuario=${req.usuario._id} and tf.Remunerado = 1;`
    }else{
        let fecha = req.query.fecha || utiles.devolverFecha();
        query = `SELECT f.*,tf.Tipo
        FROM Fichajes f
        INNER JOIN TiposFichaje tf
        ON f.IdTipoFichaje = tf.Id where f.strFecha = '${fecha}' and f.IdUsuario=${req.usuario._id};`
    }
    
    Fichaje.sequelize?.query(query,
                { type: QueryTypes.SELECT, raw: true }).then((fichajes: any) => {
        if (!fichajes) {
            return resp.json({
                ok: false,
                mensaje: 'Este usuario no tiene fichajes'
            });
        }

        let entrada;
        let salida;

        if(req.query.tiempoTrabajado=="true"){

            for (const { item, index } of fichajes.map((item: any, index: any) => ({ item, index }))) {
                if(item.Salida!==null){

                entrada = new Date(item.Entrada);
                salida = new Date(item.Salida);
                console.log("Entrada: " + entrada + " | Salida: " + salida);

                let diffSegs = (entrada.getTime() - salida.getTime())/1000;
                console.log(Math.abs(Math.trunc(diffSegs%60)));
                segs += Math.abs(Math.trunc(diffSegs%60));
                
                console.log("segs: "+segs);
                
                console.log(Math.abs(Math.trunc(diffSegs/60)));
                mins += Math.abs(Math.trunc(diffSegs/60));

                console.log("mins: "+mins);

                console.log(Math.abs(Math.trunc(diffSegs/3600)));
                horas += Math.abs(Math.trunc(diffSegs/3600));
                
                console.log("horas: "+horas);

                console.log(horas + ":" + mins + ":" + segs);

                }
            }

            if(segs>59){mins=Math.trunc(segs/60)+mins;segs=segs%60;};

            if(mins>59){horas=Math.trunc(mins/60);mins=mins%60;};

            console.log(horas + ":" + mins + ":" + segs);
            
            resp.json({
                ok:true,
                fichajes: fichajes,
                horas:horas,
                mins:mins,
                segs:segs
            });

        }else{

            for (const { item, index } of fichajes.map((item: any, index: any) => ({ item, index }))) {
                
                entrada = new Date(item.Entrada);
                salida = new Date(item.Salida);

                console.log("Entrada: " + entrada + " | Salida: " + salida);

                let diff = (entrada.getTime() - salida.getTime())/1000;
                item.segs = Math.abs(Math.trunc(diff));
                diff /= 60;
                item.mins = Math.abs(Math.trunc(diff));
                item.segs =  Math.abs(Math.trunc(item.segs - item.mins*60));
                diff /= 60;
                item.horas = Math.abs(Math.trunc(diff));
                item.mins =  Math.abs(Math.trunc(item.mins - item.horas*60));

                console.log("item.horas: " + item.horas + " | item.minutos: " + item.mins + " | item.segs: " + item.segs);

            }

            resp.json({
                ok:true,
                fichajes: fichajes
            })
        }
    });
});

export default FichajeRoutes;