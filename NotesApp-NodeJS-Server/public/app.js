var myApp = angular.module('myApp',[]).controller("myControllerContent",function($scope, $http) {
    $scope.etiquetas=[{nombre:"Universidad"},{nombre:"Personal"}];
    $scope.nota = {titulo:"Titulo", nota:"Nota", etiquetas:["Personal", " Universidad"]}

    $http.get('/api/nota/list', {headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ODRkYzQ1NjFjY2Y2YzUwZTJlMzNhNjYiLCJuYW1lIjoiRmlzZXIiLCJwYXNzd29yZCI6IiQyYSQxMCRHUmFaTXNObm9pRk9nTjRRNWR1bTlPdXB2UTN6SUI1OVF3UGFiRWpDQy9kLnBYV0ROaUlvMiIsIl9fdiI6MH0.UbfxsNtSotBmO24SbR4ZxPbsgfvHQZHS4vgBYTHKQIk' }}).success(function(data) {
        $scope.notas = data;
        console.log(data)
    }).error(function(data) {
        console.log('Error: ' + data);
    });

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
