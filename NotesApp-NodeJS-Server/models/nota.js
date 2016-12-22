var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotaSchema = new Schema({
    titulo: { type: String, required: true },
    nota: { type: String, required: true },
    location: String,
    favorito: Boolean,
    created_at: { type: Date, required: true },
    updated_at: { type: Date, default: Date.now },
    user  : { type: Schema.ObjectId, ref: 'User', required: true },
    usersLinked  : [{ type: String }],
    etiquetas: [{type: Schema.Types.ObjectId, ref: 'Etiqueta'}]
});

module.exports = mongoose.model('Nota', NotaSchema);