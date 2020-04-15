import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import Chats from '../models/chat.model';
import Utiles from "../classes/utilidades";
import Usuarios from "../models/usuario.model";


const ChatRouter = Router();

ChatRouter.post('/CrearChat',[verificaToken], async (req: any, resp: Response)=> {
    const body = req.body;

    const chatInsert = await Chats.create<Chats>(body);
    if (chatInsert) {
        resp.json({
            ok: true,
            chatInsert,
            mensaje: 'Ausencia creada correctamente'
        });
    } else {
        resp.json({
            ok: false,
            mensaje: 'Ha habido un error'
        });
    }
});

// recoger usuarios y chats a la vez 
ChatRouter.get('/getUsersAndChats',verificaToken, async (req: any, res: Response) => {
    console.log(req.usuario);

    let users:any[]=[];
    let chats:any[]=[];

    Usuarios.findAll().then((data) => {
        users = data;
        /*Chats.findAll({where: {IdUsuario: req.usuario._id}}).then((data) => {
        chats = data;
        });*/

        console.log(users);

        res.json({
            ok: true,
            usersToChat:users,
            openChats:chats
        });
    });

    

});


export default ChatRouter;