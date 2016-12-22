var config      = require('../parameters');
var jwt         = require('jwt-simple');
var User        = require('../models/user');
var Etiqueta        = require('../models/etiqueta');
var Nota        = require('../models/nota');
require('../passport')(require('passport'));

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
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
exports.etiquetaList = function(req, res) {
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
                Etiqueta.find({ user: user._id }, function(err, etiquetas) {
                    if (err) return console.error(err);
                    res.status(200).jsonp(etiquetas);
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
}
exports.etiquetaCreate = function(req, res) {
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
                    var etiqueta = new Etiqueta({
                        nombre: req.body.nombre,
                        user: user._id,
                    })
                    etiqueta.save(function(err, etiqueta) {
                        if(err) return res.status(500).send( err.message);
                        res.status(200).jsonp(etiqueta);
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
}
exports.etiquetaRemove = function(req, res) {
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
                Etiqueta.findById(req.params.id, function (err, etiqueta) {
                    if(etiqueta!=null&&etiqueta.user.equals(user._id)) {
                        if (err) return res.send(500, err.message);
                        Nota.find({ etiquetas: { "$in" : [etiqueta._id]} }, function(err, notas) {
                            if (err) return console.error(err);
                            notas.forEach(function(nota) {
                                nota.etiquetas.remove(etiqueta._id);
                                nota.save(function (err) {
                                    if (err) return res.status(500).send(err.message);
                                });
                            });
                        });
                        etiqueta.remove(function (err) {
                            if (err) return res.status(500).send(err.message);
                            res.status(200).send({success: true, msg: 'Etiqueta deleted'});
                        })
                    }else{
                        return res.status(403).send({success: false, msg: 'Etiqueta doesn\'t exit.'});
                    }
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
}
exports.etiquetaUpdate = function(req, res) {
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
                Etiqueta.findById(req.params.id, function(err, etiqueta) {
                    if(etiqueta!=null&&etiqueta.user.equals(user._id)) {
                        etiqueta.nombre = req.body.nombre;
                        etiqueta.save(function (err) {
                            if (err) return res.status(500).send(err.message);
                            res.status(200).jsonp(etiqueta);
                        });
                    }else{
                        return res.status(403).send({success: false, msg: 'Note doesn\'t exit.'});
                    }
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
}
exports.etiquetaGet = function(req, res) {
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
                Etiqueta.findById(req.params.id, function (err, etiqueta) {
                    if(etiqueta!=null&&etiqueta.user.equals(user._id)) {
                        if (err) return res.send(500, err.message);
                        Nota.find({ etiquetas: { "$in" : [etiqueta._id]} }, function(err, notas) {
                            if (err) return console.error(err);
                            res.status(200).jsonp(notas);
                        });
                    }else{
                        return res.status(403).send({success: false, msg: 'Etiqueta doesn\'t exit.'});
                    }
                });
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
}