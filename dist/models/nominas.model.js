"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nominaSchema = new mongoose_1.Schema({
    Mes: {
        type: String,
        required: [true, 'El mes es necesario']
    },
    Pdf: {
        type: [{
                type: String
            }]
    },
    Usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debes existir una referencia a un usuario']
    }
});
exports.Nomina = mongoose_1.model('Nomina', nominaSchema);
