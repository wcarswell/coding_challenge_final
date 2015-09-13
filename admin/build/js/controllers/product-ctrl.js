'use strict';

/**
 * @ngdoc function
 * @name RDash.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of RDash
 */
angular
    .module('RDash')
    .controller('ProductCtrl', ['$scope', '$state', '$http', '$modal', '$log', 'LowStockService', ProductCtrl]);

function ProductCtrl($scope, $state, $http, $modal, $log, LowStockService) {
    // Controller configs
    $scope.config = {
        'new': 'Add Product Per Clinic', // modal new description
        'modify': 'Modify Product', // modal modify description
        'modalSize': 'sm', // modal size
        'templateUrl': 'product.html', // template view to parse modal scope
        'controller': 'ModalProductCtrl', // modal controller
        'endPoint': '/reports/product/',  // endpoint for product
        'endPointClinic': '/admin/clinic/' // endpoint for clinic
    }

    // Store the selected model to update
    $scope.selected = '';

    // Set the state of navigation    
    $scope.$state = $state;

    // Set the default sort type
    $scope.sortType = 'quantity_on_hand';

    // Set the default sort order
    $scope.sortReverse  = false;

    // Loads/Reloads product list
    $scope.reloadProductList = function() {
        $http.get($scope.config.endPoint).success(function(data, status, headers, config) {
            // Bind product to return value    
            $scope.products = data;

            // Convert quantity_on_hand to number
            angular.forEach($scope.products, function (products) {
                products.quantity_on_hand = parseFloat(products.quantity_on_hand);
            });
        });
    }

    // Loads/Reloads clinic list
    $scope.reloadClinicList = function() {
        $http.get( $scope.config.endPointClinic ).success(function(data, status, headers, config) {
            // Bind clinics to return value    
            $scope.clinics = data;
        });
    } 

    // Brings up modal to modify product information
    $scope.modify = function(product) {
        $scope.openModal(product, $scope.config.modify);
    }

    // Brings up modal to insert new product
    $scope.new = function() {
        $scope.openModal('', $scope.config.new);
    }

    // Delete a product
    $scope.delete = function(product) {
        var url = $scope.config.endPoint;
        url += product.product_id + '/';

        // Ajax call to post to product information
        $http({
            url: url,
            method: "DELETE",
            data: {} // nada here
        })
        .then(function(response) {
            if (response.data.status != 'fail') {
                // Reload product list on success
                $scope.reloadProductList();
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to delete Product: ' + product.name);
        });
    }

    // Open the modal
    $scope.openModal = function(product, action) {
        // Initialise ui-bootstrap model on modify() event
        var modalProduct = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: $scope.config.templateUrl, // the html template to parse selected clinic
            controller: $scope.config.controller, // the controller to handle selected clinic
            size: $scope.config.modalSize, // size of modal
            resolve: { // send through dependencies to modal
                product: function() {
                    return product;
                },
                action: function() {
                    return action;
                },
                config: function() {
                    return $scope.config;
                },
                clinic: function() {
                    return $scope.clinics;
                }
            }
        });

        // Bind callback functions for save/cancel button
        modalProduct.result.then(function(selectedItem) {
            // Reload product list on success
            $scope.reloadProductList();
            LowStockService.reloadLowStockAlert();
        }, function() {
            // Log messaging for debug purpose
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    // Load initial list
    $scope.reloadProductList();
    $scope.reloadClinicList();
}

angular
    .module('RDash')
    .controller('ModalProductCtrl', ['$scope', '$modalInstance', '$http', 'product', 'action', 'config', 'clinic', ModalProductCtrl]);

function ModalProductCtrl($scope, $modalInstance, $http, product, action, config, clinic) {
    // Update action description
    $scope.action = action;

    // Set selected clinic to modal passed through
    $scope.selected = product;

    // Set countries to modal passed through
    $scope.clinics = clinic;

    // Event for inserting/updating a product
    $scope.ok = function() {
        var url = config.endPoint;

        // Add product_id if modifying
        if (product.hasOwnProperty('product_id')) {
            url += product.product_id + '/';
        }

        // Ajax call to post to product information
        $http({
            url: url,
            method: "POST",
            data: {
                'product': $scope.selected
            }
        })
        .then(function(response) {
            if (response.data.status != 'fail') {
                // Close modal on success
                $modalInstance.close();
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to insert/update product');
        });
    };

    // Event to dismiss modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}