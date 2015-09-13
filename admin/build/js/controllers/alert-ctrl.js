/**
 * Alerts Controller
 */

angular
    .module('RDash')
    .controller('AlertsCtrl', ['$scope', '$http', AlertsCtrl]);

function AlertsCtrl($scope, $http) {
    $scope.alerts = [];

    // Controller configs
    $scope.config = {
        'endPoint': '/reports/low_stock/' // endpoint of low stock
    }

    $scope.addAlert = function(data) {
        console.log(data);
        $scope.alerts.push({ 
            type: data.type,
            msg: data.msg 
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    // Loads/Reloads low stock list
    $scope.reloadLowStockList = function() {
        $http.get($scope.config.endPoint).success(function(data, status, headers, config) {
            // Bind tax to return value    
            $scope.products = data;

            // Clear alerts
            $scope.alerts = [];

            // Show products with low stock
            for(var i = 0; i < data.length; i ++) {
                var msg = data[i].clinic_name + ' is low on 1' + data[i].name;

                $scope.addAlert({ type: 'danger', msg: msg });
            }
        });
    }

    // Bind a broadcast to reload low stock alerts
    $scope.$on('reloadLowStockAlert', function() {
        $scope.reloadLowStockList();
    });

    // Inital Load
    $scope.reloadLowStockList();
}