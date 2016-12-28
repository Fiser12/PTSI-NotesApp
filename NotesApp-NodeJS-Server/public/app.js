var token = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ODRkYzQ1NjFjY2Y2YzUwZTJlMzNhNjYiLCJuYW1lIjoiRmlzZXIiLCJwYXNzd29yZCI6IiQyYSQxMCRHUmFaTXNObm9pRk9nTjRRNWR1bTlPdXB2UTN6SUI1OVF3UGFiRWpDQy9kLnBYV0ROaUlvMiIsIl9fdiI6MH0.UbfxsNtSotBmO24SbR4ZxPbsgfvHQZHS4vgBYTHKQIk';
var lastIdSelected = "NOTHING";
var lastIdLateralSelected = "todasLasNotasButton";
var lastEtiSelected = "";
var etiquetas = null;
var simplemde = new SimpleMDE({
    element: document.getElementById("textAreaNota"),
    autofocus: false,
    hideIcons: ["guide", "fullscreen", "side-by-side"],

});

if(!('contains' in String.prototype)) {
    String.prototype.contains = function(str, startIndex) {
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}


var myApp = angular.module('myApp',[]).controller("myControllerContent",function($scope, $http) {
    actualizarListaNotas = function($scope, $http){
        var url = '/api/nota';
        if(lastIdLateralSelected=="favoriteButton")
            url = '/api/nota/favoritas';
        else if(lastIdLateralSelected=="compartidasButton")
            url = '/api/nota/compartidas';
        else if(lastIdLateralSelected=="etiButton"+lastEtiSelected)
            url = '/api/nota/etiqueta/'+lastEtiSelected;

        $http.get(url, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            $scope.notas = data;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    }
    actualizarListaEtiquetas = function ($scope, $http) {
        $http.get('/api/etiqueta/list', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            $scope.etiquetas=data;
            etiquetas = data;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    }
    $scope.userNew = "";
    actualizarListaEtiquetas($scope, $http);
    actualizarListaNotas($scope, $http);
    $scope.getNotas = function(){
        $("#"+lastIdLateralSelected).removeClass('active');
        $("#todasLasNotasButton").addClass('active');
        lastIdLateralSelected = "todasLasNotasButton";
        $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            $scope.notas = data;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.getNotasFavoritas = function(){
        $("#"+lastIdLateralSelected).removeClass('active');
        $("#favoriteButton").addClass('active');
        lastIdLateralSelected = "favoriteButton";
        $http.get('/api/nota/favoritas', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            $scope.notas = data;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.getNotasEtiqueta = function(id){
        $("#"+lastIdLateralSelected).removeClass('active');
        $("#etiButton"+id).addClass('active');
        lastIdLateralSelected = "etiButton"+id;
        lastEtiSelected = id;
        $http.get('/api/nota/etiqueta/'+id, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            $scope.notas = data;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.getNota = function (id) {
        $("#list"+lastIdSelected).removeClass('active');
        $("#list"+id).addClass('active');
        lastIdSelected = id;

        $http.get('/api/nota/'+id, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            $scope.nota = data;
            simplemde.value(data.nota);
            $('#tagsInput').tagsinput('removeAll');
            data.etiquetas.forEach(function (etiqueta) {
                var result = etiquetas.filter(function( obj ) {
                    return obj._id == etiqueta;
                });
                $('#tagsInput').tagsinput('add', result[0].nombre );
            })
            $('#tagsInput').tagsinput('refresh');

        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.borrarNota = function (id) {
        $http.delete('/api/nota/delete/'+id, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function() {
            $("#list"+id).remove();
            $scope.nota = null;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.updateNota = function (nota) {
        var fav = 0;
        if(nota.favorito)
            fav = 1;
        var notaProcesada = simplemde.value().replace(/\r?\n/g, '\\r\\n');
        var etiquetasTemp = [];
            $("#tagsInput").tagsinput('items').toString().split(",").forEach(function(etiqueta2){
                var encontrado = false;
                etiquetas.forEach(function (etiqueta) {
                    if(etiqueta.nombre==etiqueta2.toString())
                    {
                        encontrado = true;
                        etiquetasTemp.push(etiqueta._id)
                    }
                });
                if(!encontrado){
                    $http.post('/api/etiqueta/insert', {"nombre": etiqueta2.toString()}, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data2) {
                        etiquetasTemp.push(data2.toString())
                        putNota(notaProcesada, nota, fav, etiquetasTemp, true);
                    }).error(function(data) {
                        putNota(notaProcesada, nota, fav, etiquetasTemp, false);
                        console.log('Error: ' + data);
                    });
                }else{
                    putNota(notaProcesada, nota, fav, etiquetasTemp, false);
                }
            });
    };
    $scope.crearNota = function () {
        var req = {
            method: 'POST',
            url: '/api/nota/create',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            data: '{"titulo": "Nueva Nota","nota":"","location":"location","favorito": 0}'
        }
        $http(req).then(function(data){
            $scope.nota = data;
            actualizarListaNotas($scope, $http);
        })
    };
    $scope.cambiarFavorito = function (nota) {
        nota.favorito = !nota.favorito;
    };
    $scope.anadirUsuario = function (nota, userNew) {
        $http.get('/api/user/exist/'+userNew, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            nota.usersLinked.push(userNew);
        }).error(function(data) {
            console.log('No existe');
        });
    };
    $scope.borrarUsuario = function (nota, user) {
        for (var i=nota.usersLinked.length-1; i>=0; i--) {
            if (nota.usersLinked[i] === user) {
                nota.usersLinked.splice(i, 1);
                break;
            }
        }
    };
    putNota= function(notaProcesada, nota, fav, etiquetasTemp, refrescarEtiquetas){
        var req = {
            method: 'PUT',
            url: '/api/nota/update/'+nota._id,
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            data: '{"titulo": "'+nota.titulo+'","nota":"'+notaProcesada+'","location":"'+nota.location+'","favorito": '+fav+',"etiquetas": '+JSON.stringify(etiquetasTemp)+',"usersLinked": '+JSON.stringify(nota.usersLinked)+'}'
        };
        $http(req).then(function(){
            actualizarListaNotas($scope, $http);
        });
        if(refrescarEtiquetas)
        {
            actualizarListaEtiquetas($scope, $http);
        }
    }
});