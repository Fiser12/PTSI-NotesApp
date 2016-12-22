var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EtiquetaSchema = new Schema({
    nombre: { type: String, required: true },
    user  : { type: Schema.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Etiqueta', EtiquetaSchema);