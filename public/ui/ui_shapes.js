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
    ctx.translate(0.5, 0.5)

    $scope.shapes = [];
    $scope.showRuler = true;

    $scope.adjustIcons = [
        'glyphicon glyphicon-move',
        'glyphicon glyphicon-triangle-left',
        'glyphicon glyphicon-triangle-bottom',
        'glyphicon glyphicon-triangle-right',
        'glyphicon glyphicon-triangle-top'
    ];

    if ($window.localStorage && $window.localStorage.getItem('shapes')) {
         $scope.shapes = angular.fromJson($window.localStorage.getItem('shapes'));
    } else {
        $scope.shapes = [{
            dash: false,
            points: [
                {x:0, y:0, l:'A'}, 
                {x:9, y:0, l:'B'}, 
                {x:0, y:9, l:'C'}
            ]
        }];
    }

    //-----------------------------------------------------------------------------
    function _getScale()
    {
        return maxX / $scope.nMax;
    } 

    //-----------------------------------------------------------------------------
    function _pointAt(x, y) {
        ctx.fillRect(x * _getScale() -2,  - y * _getScale() -2, 4, 4);

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
    function _letterForVertex(point, prev, next) {
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
    function _letterForLine(point, other) {
        if (!point.l)
            return;
        var xShift = 0;
        var yShift = 0;
        if (point.x < other.x)
            xShift = -20;
        else if (point.x > other.x)
            xShift = 3;
        else if (point.y < other.y)
            yShift = 20;
        else if (point.y > other.y)
            yShift = -3;

        ctx.fillText(point.l, point.x * _getScale() +xShift, -point.y * _getScale() + yShift);
    }

    //-----------------------------------------------------------------------------
    function _letterForPoint(point) {
        if (!point.l)
            return;
        var xShift = 0;
        var yShift = 0;
        if (point.adjust === 0)
            xShift = 6;
        else if (point.adjust === 1)
            xShift = -20;
        else if (point.adjust === 2) {
            yShift = -25;
            xShift = -6;
        }
        else if (point.adjust === 3)
            xShift = 6;
        else if (point.adjust === 4) {
            yShift = 6;
            xShift = -6;
        }

        ctx.fillText(point.l, point.x * _getScale() +xShift, -point.y * _getScale() - yShift);
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

  //-----------------------------------------------------------------------------
  $scope.drawGrid = function() {
    ctx.lineWidth=0.05;
    for (x = 0; x <= maxX / _getScale(); x++ ) {
      _moveTo(x, maxY);
      _lineTo(x, 0);
    }
    for (y = 0; y <= maxY / _getScale(); y++ ) {
      _moveTo(maxX, y);
      _lineTo(0, y);
    }
    ctx.stroke();
  };
  
  $scope.drawPlan();
  $scope.drawMarks();
  $scope.drawGrid();

  //-----------------------------------------------------------------------------
  $scope.clearPlan = function () {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, shapesCanvas.width, shapesCanvas.height);
    ctx.restore();

    if ($scope.showRuler) {
        ctx.beginPath();
        $scope.drawPlan();
        $scope.drawMarks();
        $scope.drawGrid();
    }
  }

  // points = [ {x:x, y:y}, ...]
  //-----------------------------------------------------------------------------
  $scope.drawPolygon = function(shape) {
    if (shape.points.length < 3)
      return;
    if (shape.dash)
        ctx.setLineDash([10, 10]);
    ctx.lineWidth=1;
    ctx.beginPath();
    _moveTo(shape.points[shape.points.length - 1].x, shape.points[shape.points.length - 1].y);
    for (p = 0; p < shape.points.length; p++) {
      _lineTo(shape.points[p].x, shape.points[p].y);
      var n = (p - 1) % (shape.points.length - 1);
      _letterForVertex(shape.points[p], shape.points[(p + shape.points.length - 1 - 1) % (shape.points.length - 1)], shape.points[(p + 1) % (shape.points.length - 1)]);
    }
    _lineTo(shape.points[0].x, shape.points[0].y);
    ctx.stroke();
    ctx.setLineDash([]);
  };
    
  //-----------------------------------------------------------------------------
  $scope.drawLine = function(shape) {
    if (shape.points.length != 2)
      return;
    if (shape.dash)
        ctx.setLineDash([10, 10]);
    ctx.lineWidth=1;
    ctx.beginPath();
    _moveTo(shape.points[0].x, shape.points[0].y);
    _lineTo(shape.points[1].x, shape.points[1].y);
    _letterForLine(shape.points[0], shape.points[1]);
    _letterForLine(shape.points[1], shape.points[0]);
    ctx.stroke();
    ctx.setLineDash([]);
  };
    
  //-----------------------------------------------------------------------------
  $scope.drawPoint = function(shape) {
    if (shape.points.length != 1)
      return;
    _pointAt(shape.points[0].x, shape.points[0].y);
    _letterForPoint(shape.points[0]);
  }
      
  //-----------------------------------------------------------------------------
  function _rescale() {
    var max = 0;
    for (s = 0; s < $scope.shapes.length; s++) {
        for (p = 0; p < $scope.shapes[s].points.length; p++) {
            if (Math.abs($scope.shapes[s].points[p].x) > max) {
                max = Math.ceil(Math.abs($scope.shapes[s].points[p].x));
            }
            if (Math.abs($scope.shapes[s].points[p].y) > max) {
                max = Math.ceil(Math.abs($scope.shapes[s].points[p].y));
            }
        }
    }
    $scope.nMax = max + Math.ceil(20 / (maxX / max));
  }
  
  //-----------------------------------------------------------------------------
  $scope.onDrawClicked = function() {
    _rescale();
    $scope.clearPlan();
    for (s = 0; s < $scope.shapes.length; s++) {
        if ($scope.shapes[s].points.length == 1) {
            $scope.drawPoint($scope.shapes[s]);
        } else if ($scope.shapes[s].points.length == 2) {
            $scope.drawLine($scope.shapes[s]);
        } else {
            $scope.drawPolygon($scope.shapes[s]);
        }
    }
    if ($window.localStorage) {
        $window.localStorage.setItem('shapes', angular.toJson($scope.shapes));
    }
  };
  
  //-----------------------------------------------------------------------------
  $scope.onAddPointClicked = function(shape) {
    shape.points.push({});
  }

  //-----------------------------------------------------------------------------
  $scope.onRemovePointClicked = function(shape) {
    shape.points.splice(-1);
  }

  //-----------------------------------------------------------------------------
  $scope.removePointDisabled = function(shape) {
    return shape.points.length <= 1;
  }

  //-----------------------------------------------------------------------------
  $scope.onAddShapeClicked = function() {
    $scope.shapes.push({
        dash: false,
        points:[{}]
    });
  }

  //-----------------------------------------------------------------------------
  $scope.onRemoveShapeClicked = function($index) {
    $scope.shapes.splice($index, 1);
  }

  //-----------------------------------------------------------------------------
  $scope.removeShapeDisabled = function() {
    return $scope.shapes.length <= 1;
  }

}]);    