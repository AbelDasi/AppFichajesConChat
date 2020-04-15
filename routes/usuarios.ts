import { Router, Request, Response } from "express";
import Token from "../classes/token";

import { verificaToken } from "../middlewares/autenticacion";
import Usuarios from "../models/usuario.model";

const userRouter = Router();

// login
userRouter.post('/login', async(req: Request, resp:Response)=> {
    const body = req.body;
    
    const user = await Usuarios.findOne({where:{Email: body.Email, Password: body.Password}});
    if (!user) {
        return resp.json({
            ok: false,
            mensaje: 'El usuario o contraseña no son correctos'
        });
        
    }
    const tokenUsuario = Token.getJwtToken({
        _id: user.Id,
        Nombre: user.Nombre,
        Email: user.Email,
        Permisos: user.Permisos,
        IdEmpresa:user.IdEmpresa
    });
   
    resp.json({
        ok: true,
        token: tokenUsuario
    });
    
});

// crear usuario 
userRouter.post('/create', async (req: Request, resp:Response)=> {
    const userInsert = await Usuarios.create<Usuarios>({
        Nombre: req.body.Nombre,
        Email: req.body.Email,
        Password: req.body.Password,
        Permisos: req.body.Permisos
    });
    
    if (userInsert) {
        resp.json({
            ok: true,
            userInsert
        });
    } else {
        resp.json({
            ok: false
        });
    }
});
// modificar usuario
userRouter.post('/update', verificaToken, (req: any, resp:Response)=> {
    
   
    Usuarios.update({Nombre: req.body.Nombre}, {where: { Id: req.usuario._id }}).then(async (data) => {
        if (data) {
            const user = await Usuarios.findOne({where:{Id: req.usuario._id}});
            const tokenUsuario = Token.getJwtToken({
                _id: user?.Id,
                Nombre: user?.Nombre,
                Email: user?.Email,
                Permisos: user?.Permisos,
                IdEmpresa:user?.IdEmpresa
            });
           
            resp.json({
                ok: true,
                data,
                token: tokenUsuario
                
            });
        } else {
            resp.json({
                ok: false
            });
        }
    });
    

});

userRouter.post('/delete', verificaToken, (req: any, resp:Response)=> {

    Usuarios.destroy({where: { Id: req.usuario._id }}).then((data) => {
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

// obtener todos los usuarios 
userRouter.get('/ObtenerUsuarios', verificaToken, async(req: any, resp:Response)=> {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;
    const config = {
        attributes: ['Id', 'Nombre', 'Email', 'Permisos'],
        
    }
     Usuarios.findAll(config).then((data) => {
        resp.json({
            ok: true,
            usuarios:data
        });
    });
});

userRouter.get('/', verificaToken, async(req: any, resp:Response)=> {
    const usuario = req.usuario;
    resp.json({
        ok: true,
        usuario
    });
});
export default userRouter;