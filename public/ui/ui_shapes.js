//=============================================================================
// ShapesController - controller for ui_shapes.html
//=============================================================================
var shapesCanvas;

var initShapes = function() {
    shapesCanvas = document.getElementById("shapesCanvas");
}

app.controller('ShapesController', ['$scope', '$http', '$rootScope', '$window', function ($scope, $http, $rootScope, $window) {
    initShapes();

    var maxX = shapesCanvas.width;
    var maxY = shapesCanvas.height;
    $scope.nMax = 10;
    var ctx = shapesCanvas.getContext("2d");
    ctx.font="20px Arial";
    ctx.setTransform(1, 0, 0, 1, 0, maxY);
    // ctx.setTransform(1, 0, 0, 1, 0, 0);

    $scope.shapes = [];

    if ($window.localStorage && $window.localStorage.getItem('shapes')) {
         $scope.shapes = angular.fromJson($window.localStorage.getItem('shapes'));
    } else {
        $scope.shapes = [
            {x:0, y:0, l:'A'}, 
            {x:9, y:0, l:'B'}, 
            {x:0, y:9, l:'C'}
        ];
    }

    //-----------------------------------------------------------------------------
    function _getScale()
    {
        return maxX / $scope.nMax;
    } 

    //-----------------------------------------------------------------------------
    function _pointAt(x, y) {
        ctx.fillRect(x * _getScale() -1,  y * _getScale() -1, 3, 3);
    };

    //-----------------------------------------------------------------------------
    function _moveTo(x, y) {
        ctx.moveTo(x * _getScale(), - y * _getScale());
    };

    //-----------------------------------------------------------------------------
    function _lineTo(x, y) {
        ctx.lineTo(x * _getScale(), - y * _getScale());
    };

    //-----------------------------------------------------------------------------
    function _letterFor(point, prev, next) {
        if (!point.l)
        return;
        var xShift = 0;
        var yShift = 0;
        if (point.x < prev.x && point.x < next.x)
            xShift = -20;
        else if (point.x > prev.x && point.x > next.x)
        xShift = 3;
        else if (point.y < prev.y && point.y < next.y)
        yShift = 20;
        else if (point.y > prev.y && point.y > next.y)
        yShift = -3;

        ctx.fillText(point.l, point.x * _getScale() +xShift, -point.y * _getScale() + yShift);
    }

  //-----------------------------------------------------------------------------
  $scope.drawPlan = function() {
    ctx.lineWidth=0.2;
    ctx.moveTo(0,0);
    ctx.lineTo(maxX,0);
    ctx.moveTo(0,0);
    ctx.lineTo(0,-maxY);
    ctx.stroke();
  };

  //-----------------------------------------------------------------------------
  $scope.drawMarks = function() {
    ctx.lineWidth=0.2;
    for (x = 0; x <= maxX / _getScale(); x++ ) {
      _moveTo(x, 0.2);
      _lineTo(x, 0);
    }
    for (y = 0; y <= maxY / _getScale(); y++ ) {
      _moveTo(0.2, y);
      _lineTo(0, y);
    }
    ctx.stroke();
  };

  $scope.drawPlan();
  $scope.drawMarks();

  //-----------------------------------------------------------------------------
  $scope.clearPlan = function () {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, shapesCanvas.width, shapesCanvas.height);
    ctx.restore();

    ctx.beginPath();
    $scope.drawPlan();
    $scope.drawMarks();
  }

  // points = [ {x:x, y:y}, ...]
  //-----------------------------------------------------------------------------
  $scope.drawPolygon = function(points) {
    if (points.length < 3)
      return;
    ctx.lineWidth=1;
    ctx.beginPath();
    _moveTo(points[points.length - 1].x, points[points.length - 1].y);
    for (p = 0; p < points.length; p++) {
      _lineTo(points[p].x, points[p].y);
      var n = (p - 1) % (points.length - 1);
      _letterFor(points[p], points[(p + points.length - 1 - 1) % (points.length - 1)], points[(p + 1) % (points.length - 1)]);
    }
    _lineTo(points[0].x, points[0].y);
    ctx.stroke();
  };
    
  //-----------------------------------------------------------------------------
  $scope.drawPoint = function(x, y) { 
      _pointAt(x, y);
  }
      
  //-----------------------------------------------------------------------------
  function _rescale() {
    var max = 0;
    for (p = 0; p < $scope.shapes.length; p++) {
        if (Math.abs($scope.shapes[p].x) > max) {
            max = Math.ceil(Math.abs($scope.shapes[p].x));
        }
        if (Math.abs($scope.shapes[p].y) > max) {
            max = Math.ceil(Math.abs($scope.shapes[p].y));
        }
    }
    $scope.nMax = max + Math.ceil(20 / (maxX / max));
  }
  
  //-----------------------------------------------------------------------------
  $scope.onDrawClicked = function() {
    _rescale();
    $scope.clearPlan();
    $scope.drawPolygon($scope.shapes);
    if ($window.localStorage) {
        $window.localStorage.setItem('shapes', angular.toJson($scope.shapes));
    }
  };
  
  //-----------------------------------------------------------------------------
  $scope.onAddLineClicked = function() {
    $scope.shapes.push({});
  }

  //-----------------------------------------------------------------------------
  $scope.onRemoveLineClicked = function() {
    $scope.shapes.splice(-1);
  }

  //-----------------------------------------------------------------------------
  $scope.removeLineDisabled = function() {
    return $scope.shapes.length <= 3;
  }

}]);    