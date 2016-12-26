var token = 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ODRkYzQ1NjFjY2Y2YzUwZTJlMzNhNjYiLCJuYW1lIjoiRmlzZXIiLCJwYXNzd29yZCI6IiQyYSQxMCRHUmFaTXNObm9pRk9nTjRRNWR1bTlPdXB2UTN6SUI1OVF3UGFiRWpDQy9kLnBYV0ROaUlvMiIsIl9fdiI6MH0.UbfxsNtSotBmO24SbR4ZxPbsgfvHQZHS4vgBYTHKQIk';
var lastIdSelected = "NOTHING";
var myApp = angular.module('myApp',[]).controller("myControllerContent",function($scope, $http) {
    $scope.etiquetas=[{nombre:"Universidad"},{nombre:"Personal"}];

    $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
        $scope.notas = data;
    }).error(function(data) {
        console.log('Error: ' + data);
    });

    $scope.getNota = function (id) {
        $http.get('/api/nota/'+id, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
            $scope.nota = data;
            $("#list"+lastIdSelected).removeClass('active');
            $("#list"+id).addClass('active');
            lastIdSelected = id;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.borrarNota = function (id) {
        $http.delete('/api/nota/delete/'+id, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function() {
            $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
                $scope.notas = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
            $scope.nota = null;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.updateNota = function (id) {
        $http.put('/api/nota/'+id, {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function() {
            $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
                $scope.notas = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
            $scope.nota = null;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    $scope.crearNota = function () {

        var req = {
            method: 'POST',
            url: '/api/nota/create',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            data: '{"titulo": "Nueva Nota","nota":"","location":"location","favorito": 1}'
        }

        $http(req).then(function(){
            $http.get('/api/nota', {headers: { 'Content-Type': 'application/json', 'Authorization': token }}).success(function(data) {
                $scope.notas = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        })
    };
});

$(document).ready(function () {
    $('#bootstrapTagsInputForm')
        .find('[name="tags"]')
        // Revalidate the cities field when it is changed
        .change(function (e) {
            $('#bootstrapTagsInputForm').formValidation('revalidateField', 'cities');
        })
        .end()
});
