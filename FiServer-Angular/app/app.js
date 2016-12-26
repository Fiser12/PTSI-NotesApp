var myApp = angular.module('myApp',[]).controller("myControllerContent",function($scope, $http) {
    $scope.etiquetas=[{nombre:"Universidad"},{nombre:"Personal"}];
    $scope.nota = {titulo:"Titulo", nota:"Nota", etiquetas:["Personal", " Universidad"]}

    $http.get('http://localhost:4000/api/nota/list', {headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRmlzZXIxMiIsInBhc3N3b3JkIjoiJDJhJDEwJEZKUXk3SnY3a3h2VUZzVExtUkJaYy5yZ1BlMVZFQVBRNlczSnJJLlBpS3pCaE5WU0dhTWJ1IiwiX2lkIjoiNTc1Y2M1NWJmZjA3ZDc3ZjExYzY1MTkzIiwiX192IjowfQ.zVl8hdaxO2wmtqERiBJeu705p6xAKtoe5Oz6ApXIMGY' }}).success(function(data) {
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
