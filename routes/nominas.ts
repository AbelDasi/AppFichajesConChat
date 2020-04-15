import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Nomina } from "../models/nominas.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";

const NominasRoutes = Router(); 
const fileSystem = new FileSystem();
NominasRoutes.post('/CrearNomina',[verificaToken], async (req: any, resp: Response)=> {
    const body = req.body;
    body.Usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesTempNomina(body.Usuario);
    body.Pdf = imagenes;
    Nomina.create(body).then(async nominaBD => {
        await  nominaBD.populate('Usuario', '-Password').execPopulate();
          resp.json({
              ok: true,
              nomina: nominaBD
          });
      }).catch(err => {
        resp.json(err)
      }); 
});
NominasRoutes.post('/SubirNomina',[verificaToken], async (req: any, resp: Response)=> {
    const body = req.body;
    body.Usuario = req.usuario;
    if(!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    const file: FileUpload = req.files.image;
    if(!file) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    if (!file.mimetype.includes('pdf')) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Solo puede subir archivos pdf'
        });
    }
    if (body.Usuario.permisos !== 'ADMINISTRADOR') {
        return resp.json({
            ok: false,
            mensaje: 'Debes ser el big boss para subir las nominas',
            body
        })
    }
    await fileSystem.guardarImagenTemporal(file, req.usuario._id);
    resp.json({
        ok: true,
        file: file.mimetype
    })
});

NominasRoutes.get('/ObtenerNomina/:img',verificaToken, async (req: any, resp: Response)=> {
const body = req.body;
body.Usuario = req.usuario._id;
const {img} = req.params;
const pathFoto = fileSystem.getFotoUrl(body.Usuario, img);
 resp.sendFile(pathFoto);
});

export default NominasRoutes;