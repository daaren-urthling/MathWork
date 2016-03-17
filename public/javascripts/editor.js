var app = angular.module("MathWork", []);

app.controller('EditorController', ['$scope', '$http', function ($scope, $http) {


$scope.onSaveClicked = function () {
    if (!$scope.exerciseName || $scope.exerciseName.lenght < 1) return;
    console.log("save " + $scope.exerciseName);
    var expr = editor.getMathML();

    $http.post('/manageFile', {name: $scope.exerciseName, content: expr }).
    success(function(data, status, headers, config) {
        console.log(data);
    }).
    error(function(data, status, headers, config) {
        console.log("something wrong there");
        console.log(data, status);
    });
}

function doPreview() {
var expr = editor.getMathML();
var prev=document.getElementById("prev");
prev.innerHTML=expr;
MathJax.Hub.Queue(["Typeset",MathJax.Hub,"prev"]);
}
function doCopy() {
var expr = editor.getMathML();
var mathML = document.querySelector('#mathML');
mathML.innerText=expr;
document.getSelection().removeAllRanges();
range= document.createRange();
range.selectNode(mathML);
document.getSelection().addRange(range);
document.execCommand('copy');
document.getSelection().removeAllRanges();
}

}]);
