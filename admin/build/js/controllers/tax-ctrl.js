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
    .controller('TaxCtrl', ['$scope', '$state', '$http', '$modal', '$log', TaxCtrl]);

function TaxCtrl($scope, $state, $http, $modal, $log) {
   // Controller configs
    $scope.config = {
        'new': 'Add Tax For Country', // modal new description
        'modify': 'Modify Tax Setup', // modal modify description
        'modalSize': 'sm', // modal size
        'templateUrl': 'tax.html', // template view to parse modal scope
        'controller': 'ModalTaxCtrl', // modal controller
        'endPoint': '/admin/tax/', // endpoint for tax
        'endPointCountry': '/admin/country/' // endpoint for country
    }

    // Store the selected model to update
    $scope.selected = '';

    // Set the state of navigation    
    $scope.$state = $state;

    // Loads/Reloads tax list
    $scope.reloadTaxList = function() {
        $http.get($scope.config.endPoint).success(function(data, status, headers, config) {
            // Bind tax to return value    
            $scope.tax = data;
        });
    }

    // Loads/Reloads country list
    $scope.reloadCountryList = function() {
    	$http.get( $scope.config.endPointCountry ).success(function(data, status, headers, config) {
            // Bind countries to return value    
            $scope.countries = data;
        });
    } 

    // Brings up modal to modify tax information
    $scope.modify = function(tax) {
        $scope.openModal(tax, $scope.config.modify);
    }

    // Brings up modal to insert new tax
    $scope.new = function() {
        $scope.openModal('', $scope.config.new);
    }

    // Delete a tax
    $scope.delete = function(tax) {
        var url = $scope.config.endPoint;
        url += tax.tax_id + '/';

        // Ajax call to post to clinic information
        $http({
            url: url,
            method: "DELETE",
            data: {} // nada here
        })
        .then(function(response) {
            if (response.data.status != 'fail') {
                // Reload tax list on success
                $scope.reloadTaxList();
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to delete Tax Setup: ' + tax.country_name);
        });
    }

    // Open the modal
    $scope.openModal = function(tax, action) {
        // Initialise ui-bootstrap model on modify() event
        var modalTax = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: $scope.config.templateUrl, // the html template to parse selected clinic
            controller: $scope.config.controller, // the controller to handle selected clinic
            size: $scope.config.modalSize, // size of modal
            resolve: { // send through dependencies to modal
                tax: function() {
                    return tax;
                },
                action: function() {
                    return action;
                },
                config: function() {
                    return $scope.config;
                },
                countries: function() {
                    return $scope.countries;
                }
            }
        });

        // Bind callback functions for save/cancel button
        modalTax.result.then(function(selectedItem) {
            // Reload tax list on success
            $scope.reloadTaxList();
        }, function() {
            // Log messaging for debug purpose
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    // Load initial list
    $scope.reloadTaxList();
    $scope.reloadCountryList();
}

angular
    .module('RDash')
    .controller('ModalTaxCtrl', ['$scope', '$modalInstance', '$http', 'tax', 'action', 'config', 'countries', ModalTaxCtrl]);

function ModalTaxCtrl($scope, $modalInstance, $http, tax, action, config, countries) {

    // Update action description
    $scope.action = action;

    // Set selected tax to modal passed through
    $scope.selected = tax;

    // Set countries to modal passed through
    $scope.countries = countries;

    // Event for inserting/updating a tax
    $scope.ok = function() {
        // Validate input
        if($scope.selected.percent.length > 3 || $scope.selected.percent > 100) {
            alert('Percent value must be smaller than 100');
            return;
        }

        if(isNaN(parseFloat($scope.selected.percent)) && !isFinite($scope.selected.percent)) {
            alert('Percent value must contain numbers');
            return;
        }
        
        var url = config.endPoint;

        // Add tax_id if modifying
        if (tax.hasOwnProperty('tax_id')) {
            url += tax.tax_id + '/';
        }

        // Ajax call to post to tax information
        $http({
            url: url,
            method: "POST",
            data: {
                'tax': $scope.selected
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
            alert('Failed to insert/update tax setup');
        });
    };

    // Event to dismiss modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}