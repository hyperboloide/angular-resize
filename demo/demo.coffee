angular.module('demo', ['angular-resize'])



angular.module('demo').controller("simpleCtrl", ["$scope", "$element", "resizable", ($scope, $element, Resizable) ->

  $scope.cols = [
    {span: 1},
    {span: 3}
  ]

  $scope.logModel = -> console.log $scope.cols

  $element.ready(->
    row = $element.find(".row")
    resizable = new Resizable($(row), $scope.cols, 4)
    resizable.update = ->
      console.log "update"
      $scope.$apply()
  )




])
