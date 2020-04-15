import {Schema, model, Document} from 'mongoose';

const nominaSchema = new Schema({
    Mes: {
        type: String,
        required: [true, 'El mes es necesario']
    },
    Pdf: {
        type:[{
            type: String
        }]
    },
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debes existir una referencia a un usuario']
    }
});
interface INomina extends Document {
    Mes: string;
    Pdf: string[];
    Usuario: string;
}
export const Nomina = model<INomina>('Nomina', nominaSchema);