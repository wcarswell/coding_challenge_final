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
    .controller('VendorCtrl', ['$scope', '$state', '$http', '$modal', '$log', 'LowStockService', VendorCtrl]);

function VendorCtrl($scope, $state, $http, $modal, $log, LowStockService) {
    // Controller configs
    $scope.config = {
        'new': 'Add Vendor', // modal new description
        'modify': 'Modify Vendor', // modal modify description
        'modalSize': '', // modal size
        'templateUrl': 'vendor.html', // template view to parse modal scope
        'controller': 'ModalVendorCtrl', // modal controller
        'endPoint': '/admin/vendor/' // endpoint for vendor
    }

    // Store the selected model to update
    $scope.selected = '';

    // Set the state of navigation    
    $scope.$state = $state;

    // Set the default sort order
    $scope.sortReverse  = false;  

    // Set the default sort type
    $scope.sortType = 'name';

    // Loads/Reloads vendor list
    $scope.reloadVendorList = function() {
        $http.get($scope.config.endPoint).success(function(data, status, headers, config) {
            // Bind tax to return value    
            $scope.vendors = data;
        });
    }

    // Brings up modal to modify vendor information
    $scope.modify = function(vendor) {
        $scope.openModal(vendor, $scope.config.modify);
    }

    // Brings up modal to insert new vendor
    $scope.new = function() {
        $scope.openModal('', $scope.config.new);
    }

    // Delete a vendor
    $scope.delete = function(vendor) {
        var url = $scope.config.endPoint;
        url += vendor.vendor_id + '/';

        // Ajax call to post to vendor information
        $http({
            url: url,
            method: "DELETE",
            data: {} // nada here
        })
        .then(function(response) {
            if (response.data.status != 'fail') {
                // Reload tax list on success
                $scope.reloadVendorList();

                // Display deleted message
                LowStockService.displayFlashMessage('Vendor deleted: ' + vendor.name);
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to delete Vendor Setup: ' + vendor.name);
        });
    }

    // Open the modal
    $scope.openModal = function(vendor, action) {
        // Initialise ui-bootstrap model on modify() event
        var modalVendor = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: $scope.config.templateUrl, // the html template to parse selected clinic
            controller: $scope.config.controller, // the controller to handle selected clinic
            size: $scope.config.modalSize, // size of modal
            resolve: { // send through dependencies to modal
                vendor: function() {
                    return vendor;
                },
                action: function() {
                    return action;
                },
                config: function() {
                    return $scope.config;
                }
            }
        });

        // Bind callback functions for save/cancel button
        modalVendor.result.then(function(action) {
            // Reload vendor list on success
            $scope.reloadVendorList();

            // Display deleted/updated message
            if(action == $scope.config.new) {
                LowStockService.displayFlashMessage('Vendor added');
            } else {
                LowStockService.displayFlashMessage('Vendor modified: ' + vendor.name);
            }
        }, function() {
            // Log messaging for debug purpose
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    // Load initial list
    $scope.reloadVendorList();  
}

angular
    .module('RDash')
    .controller('ModalVendorCtrl', ['$scope', '$modalInstance', '$http', 'vendor', 'action', 'config', ModalVendorCtrl]);

function ModalVendorCtrl($scope, $modalInstance, $http, vendor, action, config) {
	// Update action description
    $scope.action = action;

    // Set selected vendor to modal passed through
    $scope.selected = vendor;

    // Validation function to test email
    $scope.validateEmail = function(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    // Event for inserting/updating a vendor
    $scope.ok = function() {
        var msg = '';
        
        if( $scope.selected.name == '') {
            msg += 'Name cannot be empty\n';
        } 

        if( !$scope.validateEmail($scope.selected.email) ) {
            msg += 'Valid email address in format foo@example.com';
        }

        if(msg == '') {
            var url = config.endPoint;
            if (vendor.hasOwnProperty('vendor_id')) {
                url += vendor.vendor_id + '/';
            }

            // Ajax call to post to vendor information
            $http({
                url: url,
                method: "POST",
                data: {
                    'vendor': $scope.selected
                }
            })
            .then(function(response) {
                if (response.data.status != 'fail') {
                    // Close modal on success
                    $modalInstance.close(action);
                } else {
                    // Alert user on any errors
                    alert(response.data.message);
                }
            },
            function(response) { // optional
                // Inserting/Updating has failed, alert user
                alert('Failed to insert/update vendor setup');
            });
        } else {
            alert(msg);
        }
    };

    // Event to dismiss modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}