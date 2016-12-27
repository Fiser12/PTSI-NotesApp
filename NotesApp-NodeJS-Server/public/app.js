var token = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ODRkYzQ1NjFjY2Y2YzUwZTJlMzNhNjYiLCJuYW1lIjoiRmlzZXIiLCJwYXNzd29yZCI6IiQyYSQxMCRHUmFaTXNObm9pRk9nTjRRNWR1bTlPdXB2UTN6SUI1OVF3UGFiRWpDQy9kLnBYV0ROaUlvMiIsIl9fdiI6MH0.UbfxsNtSotBmO24SbR4ZxPbsgfvHQZHS4vgBYTHKQIk';
var lastIdSelected = "NOTHING";
var lastIdLateralSelected = "todasLasNotasButton";
var etiquetas = null;

if(!('contains' in String.prototype)) {
    String.prototype.contains = function(str, startIndex) {
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}


var myApp = angular.module('myApp',[]).controller("myControllerContent",function($scope, $http) {
    $http.get('/api/etiqueta/list', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
        $scope.etiquetas=data;
        etiquetas = data;
    }).error(function(data) {
        console.log('Error: ' + data);
    });
    $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
        $scope.notas = data;
    }).error(function(data) {
        console.log('Error: ' + data);
    });
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
        var notaProcesada = nota.nota.replace(/\r?\n/g, '\\r\\n');
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
    putNota= function(notaProcesada, nota, fav, etiquetasTemp, refrescarEtiquetas){
        var req = {
            method: 'PUT',
            url: '/api/nota/update/'+nota._id,
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            data: '{"titulo": "'+nota.titulo+'","nota":"'+notaProcesada+'","location":"'+nota.location+'","favorito": '+fav+',"etiquetas": '+JSON.stringify(etiquetasTemp)+'}'
        }
        $http(req).then(function(){
            $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
                $scope.notas = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        })
        if(refrescarEtiquetas)
        {
            $http.get('/api/etiqueta/list', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
                $scope.etiquetas=data;
                etiquetas = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        }

    }
    $scope.crearNota = function () {
        var req = {
            method: 'POST',
            url: '/api/nota/create',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            data: '{"titulo": "Nueva Nota","nota":"","location":"location","favorito": 0}'
        }
        $http(req).then(function(data){
            $scope.nota = data;
            $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
                $scope.notas = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        })
    };
    $scope.cambiarFavorito = function (nota) {
        nota.favorito = !nota.favorito;
    };

});