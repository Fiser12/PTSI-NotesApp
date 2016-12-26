//Carga de express
var express         = require("express"),
    jwt             = require('jwt-simple'),
    passport	    = require('passport'),
    mongoose        = require('mongoose'),
    bodyParser      = require('body-parser'),
    app             = express(),
    apiRoutes       = express.Router();
var config          = require('./parameters');
    port            = process.env.PORT || 4000,
    models          = require('./models/user');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

require('./passport')(passport);
mongoose.connect(config.database, function(err) {
    if(err) throw err;
    else console.log('Connected to Database');
});
app.set('superSecret', config.secret);


//Carga de controladores
var UsersCtrl = require('./controllers/UserController');
var NotaCtrl = require('./controllers/NotaController');
var EtiquetaCtrl = require('./controllers/EtiquetaController');

apiRoutes.post('/signup', UsersCtrl.signup);
apiRoutes.post('/authenticate', UsersCtrl.authenticate);
apiRoutes.get('/nota/list', passport.authenticate('jwt', { session: false}), NotaCtrl.notaList);
apiRoutes.post('/nota/insert', passport.authenticate('jwt', { session: false}), NotaCtrl.notaCreate);
apiRoutes.post('/nota/delete/:id', passport.authenticate('jwt', { session: false}), NotaCtrl.notaRemove);
apiRoutes.put('/nota/update/:id', passport.authenticate('jwt', { session: false}), NotaCtrl.notaUpdate);
apiRoutes.get('/nota/:id', passport.authenticate('jwt', { session: false}), NotaCtrl.notaGet);
//---------------------------------------------------------------------------------------------
apiRoutes.get('/etiqueta/list', passport.authenticate('jwt', { session: false}), EtiquetaCtrl.etiquetaList);
apiRoutes.post('/etiqueta/insert', passport.authenticate('jwt', { session: false}), EtiquetaCtrl.etiquetaCreate);
apiRoutes.post('/etiqueta/delete/:id', passport.authenticate('jwt', { session: false}), EtiquetaCtrl.etiquetaRemove);
apiRoutes.put('/etiqueta/update/:id', passport.authenticate('jwt', { session: false}), EtiquetaCtrl.etiquetaUpdate);
apiRoutes.get('/etiqueta/:id', passport.authenticate('jwt', { session: false}), EtiquetaCtrl.etiquetaGet);

app.use('/api', apiRoutes);
// Start server
app.listen(port);
module.exports = app;

