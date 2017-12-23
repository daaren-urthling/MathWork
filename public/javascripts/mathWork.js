// var editor;
// window.onload = function () {

//     editor = com.wiris.jsEditor.JsEditor.newInstance({
//     'language': 'en'
//     });
//     editor.insertInto(document.getElementById('editorContainer'));

//     MathJax.Hub.Config({
//         CommonHTML : {
//             scale: 200
//         },
//         "HTML-CSS": {
//             preferredFont: "TeX"
//         }
//     });
// }

//=============================================================================
// TabController - controller for the tabber
//=============================================================================

app.controller('TabController', ['$scope', function ($scope) {
    $scope.current = 1;
    
    $scope.setCurr = function (id) {
        $scope.current = id;
    };

    $scope.isCurr = function (id) {
        return $scope.current === id;
    };
    
}]);