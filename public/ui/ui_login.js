//=============================================================================
// LoginController - controller for ui_login.html
//=============================================================================

app.controller('LoginController', ['$scope', '$location', '$rootScope', function ($scope, $location, $rootScope) {

  $rootScope.loggedUser = null;

  //-----------------------------------------------------------------------------
  $scope.onLoginClicked = function(){

    if(!$scope.formData.email || $scope.formData.email.length < 1 || !$scope.formData.password || $scope.formData.password.length < 1)
      return;

    $scope.loginError = null;
    
    var ok =  ($scope.formData.email === 'finmcmissile2002@gmail.com' && $scope.formData.password === 'Elico0097') ||
              ($scope.formData.email === 'giovannicanto@gmail.com' && $scope.formData.password === 'GIOGIOGIO2004');  

    if (ok) {
      $rootScope.loggedUser = $scope.formData.email;
      editor = null;
      $location.url("/editor");
    }
    else {
      $scope.loginError = 'login errata';
    }
  };

  //-----------------------------------------------------------------------------
  $scope.onCloseLoginError = function(){
    $scope.loginError = null;
  };

}]);
