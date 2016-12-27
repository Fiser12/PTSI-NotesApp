var config      = require('../parameters');
var jwt         = require('jwt-simple');
var User        = require('../models/user');
var Nota        = require('../models/nota');
var Etiqueta        = require('../models/etiqueta');
require('../passport')(require('passport'));
var PushServer        = require('../controllers/PushServer');

var getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

exports.notaList = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Nota.find({ user: user._id }, function(err, notas) {
                    if (err) return console.error(err);
                    res.status(200).jsonp(notas);
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};
exports.notaListFav = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Nota.find({ user: user._id, favorito: true }, function(err, notas) {
                    if (err) return console.error(err);
                    res.status(200).jsonp(notas);
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};
exports.notaListEtiqueta = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Nota.find({ user: user._id, etiquetas: req.params.id }, function(err, notas) {
                    if (err) return console.error(err);
                    res.status(200).jsonp(notas);
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};

exports.notaCreate = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                try {
                    var nota = new Nota({
                        titulo: req.body.titulo,
                        nota: ' '+req.body.nota,
                        location: req.body.location,
                        favorito: 0,
                        created_at: Date.now(),
                        updated_at: Date.now(),
                        user: user._id
                    });
                    nota.save(function (err, nota) {
                        if (err){
                            return res.status(500).send(err.message);
                        }
                        res.status(200).jsonp(nota);
                    });
                }
                catch(err) {
                    return res.status(403).send({success: false, msg: 'Estructura no valida'});
                }
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};
exports.notaRemove = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Nota.findById(req.params.id, function(err, nota) {
                    if(nota!=null&&(nota.user.equals(user._id)||nota.usersLinked.contains(user.name))) {
                        nota.remove(function (err) {
                            if (err) return res.status(500).send(err.message);
                            PushServer.borrarNota(req.params.id, req.params.id);
                            res.status(200).send({success: true, msg: 'Note deleted'});
                        })
                    }else{
                        return res.status(403).send({success: false, msg: 'Note doesn\'t exit.'});
                    }
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};
exports.notaUpdate = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                Nota.findById(req.params.id, function(err, nota) {
                    if(nota!=null&&(nota.user.equals(user._id)||nota.usersLinked.contains(user.name))) {
                        var comprobarEti = true;
                        if(req.body.hasOwnProperty("titulo")) nota.titulo = req.body.titulo;
                        if(req.body.hasOwnProperty("nota")) nota.nota = req.body.nota;
                        if(req.body.hasOwnProperty("location")) nota.location = req.body.location;
                        if(req.body.hasOwnProperty("favorito")) nota.favorito = req.body.favorito;
                        if(req.body.hasOwnProperty("etiquetas")) {
                            req.body.etiquetas.forEach(function(etiqueta) {
                                if(!comprobarEtiquetaExistente(etiqueta)){
                                    comprobarEti = false;
                                }
                            });
                            if(comprobarEti) nota.etiquetas = req.body.etiquetas;
                        }
                        if(req.body.hasOwnProperty("usersLinked")) nota.usersLinked = req.body.usersLinked;
                        nota.updated_at = Date.now();
                        if(comprobarEti){
                            nota.save(function (err) {
                                if (err) return res.status(500).send(err.message)
                                PushServer.enviarNota(req.params.id, nota);
                                res.status(200).jsonp(nota);
                            });
                        }else{
                            return res.status(403).send({success: false, msg: 'One of the tags doesn\' exit.'});
                        }
                    }else{
                        return res.status(403).send({success: false, msg: 'Note doesn\'t exit.'});
                    }
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};
exports.notaGet = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                    Nota.findById(req.params.id, function (err, nota) {
                        if(nota!=null&&(nota.user.equals(user._id)||nota.usersLinked.contains(user.name.toString()))) {
                            if (err) return res.send(500, err.message);
                            res.status(200).jsonp(nota);
                        }else{
                            return res.status(403).send({success: false, msg: 'Note doesn\'t exit.'});
                        }
                    });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};
exports.existUser = function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                var encontrado = User.findOne({name: req.params.id});
                if(encontrado&&user.name!=req.params.id)
                    return res.status(200).send({success: true, msg: 'Existe'});
                else
                    return res.status(403).send({success: false, msg: 'No existe'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};


function comprobarEtiquetaExistente(etiqueta) {
    return Etiqueta.findById(etiqueta, function () {
    });
};
function comprobarUsuarioExistente(user) {
    return User.find({ name: user }, function() {
    });
}
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
