var app = angular.module("MathWork", []);

app.controller('EditorController', ['$scope', '$http', function ($scope, $http) {

function setEditMode(inEdit) {
  var headerContainer = angular.element( document.querySelector( '#headerContainer' ) );
  var editorContainer = angular.element( document.querySelector( '#editorContainer' ) );
  var footerContainer = angular.element( document.querySelector( '#footerContainer' ) );
  if (inEdit) {
    headerContainer.addClass("disableddiv");
    editorContainer.removeClass("disableddiv");
    footerContainer.removeClass("disableddiv");
  } else {
    headerContainer.removeClass("disableddiv");
    editorContainer.addClass("disableddiv");
    footerContainer.addClass("disableddiv");
  }
  $scope.isEditMode = inEdit;
}

setEditMode(false);

$scope.query = function(){
  $http.get('/manageFile/').
    success(function(data, status, headers, config) {
      $scope.solvedExercises = data;
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      console.log(status);
    });
};
$scope.solvedExercises =   $scope.query();

$scope.onSolvedExerciseChosen = function () {
  if (!$scope.solvedExercise || $scope.solvedExercise.lenght < 1) return;

  console.log("downloading " + $scope.solvedExercise);
  $http.get('/manageFile/' + $scope.solvedExercise).
    success(function(data, status, headers, config) {
      console.log(data);
      editor.setMathML(data);
      $scope.exercise = $scope.solvedExercise;
      $scope.solvedExercise = "";
      setEditMode(true);
    }).
    error(function(data, status, headers, config) {
      console.log(status);
    });
};

$scope.onNewExercise = function () {
  if (!$scope.exercise || $scope.exercise.lenght < 1) return;
  editor.setMathML("<math></math>");
  setEditMode(true);
};

$scope.onCancelClicked = function () {
  editor.setMathML("<math></math>");
  $scope.exercise = '';
  setEditMode(false);
};

$scope.onSaveClicked = function (partial) {
    if (!$scope.exercise || $scope.exercise.lenght < 1) return;
    console.log("save " + $scope.exercise);
    var expr = editor.getMathML();

    $http.post('/manageFile', {name: $scope.exercise, content: expr }).
    success(function(data, status, headers, config) {
        console.log(data);
        if (!partial) {
          editor.setMathML("<math></math>");
          setEditMode(false);
          $scope.solvedExercises =   $scope.query();
          $scope.exercise = '';
        }
    }).
    error(function(data, status, headers, config) {
        console.log("something wrong there");
        console.log(data, status);
    });
};

$scope.onDeleteClicked = function () {
  if (!$scope.exercise || $scope.exercise.lenght < 1) return;
  $http.post('/manageFile/delete', {name: $scope.exercise }).
  success(function(data, status, headers, config) {
    editor.setMathML("<math></math>");
    $scope.exercise = '';
    setEditMode(false);
    $scope.solvedExercises =   $scope.query();
  }).
  error(function(data, status, headers, config) {
      console.log("something wrong there");
      console.log(data, status);
  });
};

}]);

app.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction);
                        }
                    });
                }
            };
    }]);


// function doPreview() {
// var expr = editor.getMathML();
// var prev=document.getElementById("prev");
// prev.innerHTML=expr;
// MathJax.Hub.Queue(["Typeset",MathJax.Hub,"prev"]);
// }
// function doCopy() {
// var expr = editor.getMathML();
// var mathML = document.querySelector('#mathML');
// mathML.innerText=expr;
// document.getSelection().removeAllRanges();
// range= document.createRange();
// range.selectNode(mathML);
// document.getSelection().addRange(range);
// document.execCommand('copy');
// document.getSelection().removeAllRanges();
// }
