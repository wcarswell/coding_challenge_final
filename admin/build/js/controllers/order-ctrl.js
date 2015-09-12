'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:CountryCtrl
 * @description
 * # CountryCtrl
 * Controller of yapp
 */
angular
    .module('RDash')
    .controller('OrderCtrl', ['$scope', '$state', '$http', '$modal', '$log', OrderCtrl]);

function OrderCtrl($scope, $state, $http, $modal, $log) {

    // Controller configs
    $scope.config = {
        'new': 'Add Order', // modal new description
        'modify': 'Modify Order', // modal modify description
        'modalSize': '', // modal size
        'templateUrl': 'order.html', // template view to parse modal scope
        'quantity_on_hand': 5, // set minimum quantity purchase for temp order line
        'controller': 'ModalOrderCtrl', // modal controller
        'endPoint': '/admin/orders/', // endpoint for orders
        'endPointVendor': '/admin/vendor/', // endpoint for vendor
        'endPointTax': '/admin/tax_with_currency/', // endpoint for tax
        'endPointClinic': '/admin/clinic', // endpoint for clinic
        'endPointClinicProduct': '/admin/product_by_clinic_id/', // endpoint for product clinic
        'endPointOrderLine': '/admin/orders_line/' // endpoint for order line
    }

    // Store the selected model to update
    $scope.selected = '';

    // Set the state of navigation    
    $scope.$state = $state;

    // Loads/Reloads order list
    $scope.reloadOrdersList = function() {
        $http.get($scope.config.endPoint).success(function(data, status, headers, config) {
            // Bind countries to return value    
            $scope.orders = data;
        });
    }

    // Loads/Reloads vendor list
    $scope.reloadVendorsList = function() {
        $http.get( $scope.config.endPointVendor ).success(function(data, status, headers, config) {
            // Bind countries to return value    
            $scope.vendors = data;
        });
    } 

    // Loads/Reloads tax list
    $scope.reloadTaxList = function() {
        $http.get( $scope.config.endPointTax ).success(function(data, status, headers, config) {
            // Bind countries to return value    
            $scope.tax = data;
        });
    }

    // Loads/Reloads clinic list
    $scope.reloadClinicList = function() {
        $http.get( $scope.config.endPointClinic ).success(function(data, status, headers, config) {
            // Bind countries to return value    
            $scope.clinics = data;
        });
    }  

    // Brings up modal to modify order information
    $scope.modify = function(order) {
        $scope.openModal(order, $scope.config.modify);
    }

    // Brings up modal to insert new order
    $scope.new = function() {
        $scope.openModal('', $scope.config.new);
    }

    // Delete a order
    $scope.delete = function(order) {
        var url = $scope.config.endPoint;
        url += order.stock_order_id + '/';

        // Ajax call to post to order information
        $http({
            url: url,
            method: "DELETE",
            data: {} // nada here
        })
        .then(function(response) {
            if (response.data.status != 'fail') {
                // Reload order list on success
                $scope.reloadOrdersList();
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to delete order: ' + order.stock_order_id);
        });
    }

    // Open the modal
    $scope.openModal = function(order, action) {
        // Initialise ui-bootstrap model on modify() event
        var modalOrder = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: $scope.config.templateUrl, // the html template to parse selected clinic
            controller: $scope.config.controller, // the controller to handle selected clinic
            size: $scope.config.modalSize, // size of modal
            resolve: { // send through dependencies to modal controller
                order: function() {
                    return order;
                },
                action: function() {
                    return action;
                },
                config: function() {
                    return $scope.config;
                },
                vendors: function() {
                    return $scope.vendors;
                },
                tax: function() {
                    return $scope.tax;
                },
                clinic: function() {
                    return $scope.clinics;
                }
            }
        });

        // Bind callback functions for save/cancel button
        modalOrder.result.then(function(selectedItem) {
            // Reload lists
            $scope.reloadOrdersList();
            $scope.reloadLowStockAlert();
        }, function() {
            // Log messaging for debug purpose
            $scope.reloadOrdersList();
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    // Load initial list
    $scope.reloadOrdersList();
    $scope.reloadVendorsList();
    $scope.reloadTaxList();
    $scope.reloadClinicList();
}

angular
    .module('RDash')
    .controller('ModalOrderCtrl', ['$scope', '$modalInstance', '$http', 'order', 'action', 'config', 'vendors', 'tax', 'clinic' , ModalOrderCtrl]);

function ModalOrderCtrl($scope, $modalInstance, $http, order, action, config, vendors, tax, clinic) {
    
    // Update action description
    $scope.action = action;

    // Set selected order to modal passed through
    $scope.selected = order;
    
    // Set orders line to modal passed through
    $scope.ordersLines = [];

    // Set current order line
    $scope.currentOrderLine = order.orderLines;

    // Set countries to modal passed through
    $scope.vendors = vendors;

    // Set countries to modal passed through
    $scope.tax = tax;

    // Event for Order Line manipulation
    $scope.newOrderLine = function() 
    {
        // Add new temp order line
        $scope.ordersLines.push({'quantity_on_hand': config.quantity_on_hand, 'clinics': clinic});
    }

    // Event for removing order line
    $scope.removeOrderLine = function(index, ordersLines)
    {   
        // remove the one by index
        ordersLines.splice(index,1);
    }

    // Event to cancel complete order line
    $scope.removeAllOrderLine = function(index, ordersLines)
    {   
        var url = config.endPointOrderLine;
        url += order.stock_order_id + '/';

        // Ajax call to post to order information
        $http({
            url: url,
            method: "DELETE",
            data: {} // nada here
        })
        .then(function(response) {
            if (response.data.status != 'fail') {
                // Reload tax list on success
                $scope.currentOrderLine = [];
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to delete orderline');
        });
    }

    // Event for fetching available products for Clinic
    $scope.getProductsByClinic = function(clinic_id, index, ordersLines)
    {   
        var url = config.endPointClinicProduct;
        url += clinic_id + '/';

        $http.get( url ).success(function(data, status, headers, config) {
            // Bind products to return value    
            $scope.ordersLines[index].products = data;
        });
    }

    // Event for inserting/updating a order
    $scope.ok = function() {
        var url = config.endPoint;

        // Add stock_order_id if modifying
        if (order.hasOwnProperty('stock_order_id')) {
            url += order.stock_order_id + '/';
        }
        console.log( $scope.ordersLines);
        // // Ajax call to post to clinic information
        $http({
            url: url,
            method: "POST",
            data: {
                'order': $scope.selected,
                'orderlines': $scope.ordersLines
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
            alert('Failed to insert/update order');
        });
    };

    // Event to dismiss modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}