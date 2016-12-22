/**
 * Created by Fiser on 13/12/2016.
 */
var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '279698',
    key: '40ef5d78852008526824',
    secret: '97604934314ae814d48b',
    cluster: 'eu',
    encrypted: true
});

exports.enviarNota = function (token, nota) {
    pusher.trigger(token, 'notaUpdate', {
        "nota": nota
    });
}
exports.borrarNota = function (token, id) {
    pusher.trigger(token, 'notaDelete', {
        "id": id
    });
}