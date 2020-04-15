import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import Ausencias from '../models/ausencia.model';

const AusenciasRoutes = Router(); 
AusenciasRoutes.post('/CrearAusencia',[verificaToken], async (req: any, resp: Response)=> {
    const body = req.body;

    const ausenciaInsert = await Ausencias.create<Ausencias>(body);
    if (ausenciaInsert) {
        resp.json({
            ok: true,
            ausenciaInsert,
            mensaje: 'Ausencia creada correctamente'
        });
    } else {
        resp.json({
            ok: false,
            mensaje: 'Ha habido un error'
        });
    }
});

// recoger ausencias 
AusenciasRoutes.get('/ObtenerAusencias', async (req: any, res: Response) => {
    const config = {
        attributes: ['Id', 'Tipo'],
    }
    Ausencias.findAll(config).then((data) => {
        res.json({
            ok: true,
            ausencias:data
        });
    });
});


export default AusenciasRoutes;