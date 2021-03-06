'use strict';

/**
 * @ngdoc function
 * @name RDash.controller:CountryCtrl
 * @description
 * # CountryCtrl
 * Controller of RDash
 */
angular
    .module('RDash')
    .controller('LowStockCtrl', ['$scope', '$state', '$http', '$modal', '$log', LowStockCtrl]);

function LowStockCtrl($scope, $state, $http, $modal, $log) {
   
    // Controller configs
    $scope.config = {
        'endPoint': '/reports/low_stock/' // endpoint of low stock
    }

    // Store the selected model to update
    $scope.selected = '';

    // Set the state of navigation    
    $scope.$state = $state;

    // Set the default sort type
    $scope.sortType = 'quantity_on_hand';

    // Set the default sort order
    $scope.sortReverse  = false;

    // Loads/Reloads low stock list
    $scope.reloadLowStockList = function() {
        $http.get($scope.config.endPoint).success(function(data, status, headers, config) {
            // Bind tax to return value    
            $scope.products = data;

            // Convert quantity_on_hand to number
            angular.forEach($scope.products, function (products) {
                products.quantity_on_hand = parseFloat(products.quantity_on_hand);
            });
        });
    }

    // Inital Load
    $scope.reloadLowStockList();
}