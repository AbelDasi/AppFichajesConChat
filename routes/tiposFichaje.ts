import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import TiposFichajes from "../models/tiposFichajes.model";
import Utiles from "../classes/utilidades";
import Fichaje  from "../models/fichaje.model";
import { QueryTypes } from "sequelize";

const utiles = new Utiles();

const TiposFichaje = Router(); 
TiposFichaje.post('/CrearTipoDeFichaje',[verificaToken], async (req: any, resp: Response)=> {
      const body = req.body;
      const salidaInsert = await TiposFichajes.create<TiposFichajes>(body);
    if (salidaInsert) {
        resp.json({
            ok: true,
            salidaInsert,
            mensaje: 'Tipo de fichaje creado correctamente'
        });
    } else {
        resp.json({
            ok: false,
            mensaje: 'Ha habido un error'
        });
    }
});

TiposFichaje.post('/BorrarTipoDeFichaje', [verificaToken], async (req: any, resp: Response) => {
    TiposFichajes.destroy({where : { Id:req.body.Id}}).then(data => {
        resp.json({
            ok:true,
            data:data
        })
    })
})

TiposFichaje.get('/ObtenerTiposDeFichajeDisponibles',[verificaToken], async (req: any, res: Response) => {

    Fichaje.sequelize?.query(`select tpf.Id, tpf.Remunerado,f.Entrada from TiposFichaje tpf 
    inner join Fichajes f on f.IdTipoFichaje = tpf.Id 
    where f.IdUsuario = '${req.usuario._id}'
    AND f.strFecha = '${utiles.devolverFecha()}';`,
    { type: QueryTypes.SELECT}).then((fichajesUsuario: any) =>{

        let ultimoFichaje = fichajesUsuario[fichajesUsuario.length-1];

        if(fichajesUsuario.length>0){
            TiposFichajes.findAll({where:{Remunerado:!ultimoFichaje.Remunerado}}).then(tiposFichaje =>{
                let tiposFichajeSinRealizar = tiposFichaje.filter(function(tipofichaje){
                    let flagReturn=true;
                    fichajesUsuario.forEach(function(fichajeUsuario:any){
                        if(tipofichaje.Id==fichajeUsuario.Id){
                            flagReturn = false;
                        }
                    });
                    if(flagReturn)
                        return true;
                    else
                        return false;
                });
                res.json({
                    ok:true,
                    tiposFichajeDisponibles: tiposFichajeSinRealizar,
                    fichajesUsuario:fichajesUsuario,
                    ultimoFichaje:ultimoFichaje
                })
            })
        }else{
            TiposFichajes.findAll().then(tiposFichaje =>{
                res.json({
                    ok:true,
                    tiposFichajeDisponibles: tiposFichaje,
                    ultimoFichaje:{Remunerado:false}
                })
            })
        }
    })
})   

export default TiposFichaje;