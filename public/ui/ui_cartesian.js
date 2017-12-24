//=============================================================================
// CartesianController - controller for ui_cartesian.html
//=============================================================================
var canvas;

var initCartesian = function() {
    canvas = document.getElementById("myCanvas");
}

app.controller('CartesianController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    initCartesian();

    var maxX = canvas.width / 2;
    var maxY = canvas.height / 2;
    $scope.nMax = 10;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, maxX, maxY);

    $scope.points = [
        {x:-0, y:0, l:'A'}, 
        {x:2, y:9, l:'B'}, 
        {x:-3, y:-6, l:'C'}
    ];

    //-----------------------------------------------------------------------------
    function _getScale()
    {
        return maxX / $scope.nMax;
    } 

    //-----------------------------------------------------------------------------
    function _pointAt(x, y) {
        ctx.fillRect(x * _getScale() -1, -y * _getScale() -1, 3, 3);
    };

    //-----------------------------------------------------------------------------
    function _moveTo(x, y) {
        ctx.moveTo(x * _getScale(), -y * _getScale());
    };

    //-----------------------------------------------------------------------------
    function _lineTo(x, y) {
        ctx.lineTo(x * _getScale(), -y * _getScale());
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
    // ctx.setTransform(1, 0, 0, -1, maxX, maxY);
    // ctx.setTransform(1, 0, 0, 1, maxX, maxY);
    ctx.lineWidth=0.2;
    ctx.moveTo(-maxX,0);
    ctx.lineTo(maxX,0);
    ctx.moveTo(0,maxY);
    ctx.lineTo(0,-maxY);
    ctx.stroke();
    _pointAt(0,0);
    ctx.font="18px Verdana";
    ctx.fillText("O",-20,20);
  };

  //-----------------------------------------------------------------------------
  $scope.drawMarks = function() {
    ctx.lineWidth=0.2;
    for (x = -(maxX / _getScale()); x <= maxX / _getScale(); x++ ) {
      _moveTo(x, 0.2);
      _lineTo(x,-0.2);
    }
    for (y = -(maxY / _getScale()); y <= maxY / _getScale(); y++ ) {
      _moveTo(0.2, y);
      _lineTo(-0.2, y);
    }
    ctx.stroke();
  };

  $scope.drawPlan();
  $scope.drawMarks();

  //-----------------------------------------------------------------------------
  $scope.clearPlan = function () {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    for (p = 0; p < $scope.points.length; p++) {
        if (Math.abs($scope.points[p].x) > max) {
            max = Math.ceil(Math.abs($scope.points[p].x));
        }
        if (Math.abs($scope.points[p].y) > max) {
            max = Math.ceil(Math.abs($scope.points[p].y));
        }
    }
    $scope.nMax = max + 1;
  }
  
  //-----------------------------------------------------------------------------
  $scope.onDrawClicked = function() {
    _rescale();
    $scope.clearPlan();
    $scope.drawPolygon($scope.points);
  };
  
  //-----------------------------------------------------------------------------
  $scope.onAddLineClicked = function() {
      $scope.points.push({});
  }

}]);    