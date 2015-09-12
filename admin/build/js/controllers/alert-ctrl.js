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


    $scope.$on('addAlert', function(msg) {
        $scope.addAlert(msg);
    });

    $scope.addAlert = function(type, msg) {
        $scope.alerts.push({ 
            type: type,
            msg: msg 
        });

        console.log($scope.alerts);
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
                $scope.addAlert('danger', data[i].clinic_name + ' is low on ' + data[i].name);
            }
        });
    }

    $scope.$on('reloadLowStockAlert', function() {
        $scope.reloadLowStockList();
    });

    // Inital Load
    $scope.reloadLowStockList();
}