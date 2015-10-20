(function() {
  angular.module('demo', ['angular-resize']);

  angular.module('demo').controller("simpleCtrl", [
    "$scope", "$element", "resizable", function($scope, $element, Resizable) {
      $scope.cols = [
        {
          span: 1
        }, {
          span: 3
        }
      ];
      $scope.logModel = function() {
        return console.log($scope.cols);
      };
      return $element.ready(function() {
        var resizable, row;
        row = $element.find(".row");
        resizable = new Resizable($(row), $scope.cols, 4);
        return resizable.update = function() {
          console.log("update");
          return $scope.$apply();
        };
      });
    }
  ]);

}).call(this);
