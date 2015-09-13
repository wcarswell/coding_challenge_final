'use strict';

/**
 * @ngdoc function
 * @name RDash.controller:ClinicCtrl
 * @description
 * # ClinicCtrl
 * Controller of RDash
 */
angular
    .module('RDash')
    .controller('ClinicCtrl', ['$scope', '$state', '$http', '$modal', '$log', 'LowStockService', ClinicCtrl]);

function ClinicCtrl($scope, $state, $http, $modal, $log, LowStockService) {

    // Controller configs
    $scope.config = {
        'new': 'Add Clinic', // modal new description
        'modify': 'Modify Clinic', // modal modify description
        'modalSize': '', // modal size
        'templateUrl': 'clinic.html', // template view to parse modal scope
        'controller': 'ModalClinicCtrl', // modal controller
        'endPoint': '/admin/clinic/', // endpoint for clinic
        'endPointCountry': '/admin/country/' // endpoint for country
    }

    // Store the selected model to update
    $scope.selected = '';

    // Set the state of navigation    
    $scope.$state = $state;

    // Set the default sort type
    $scope.sortType = 'name';

    // Set the default sort order
    $scope.sortReverse  = false;

    // Loads/Reloads clinic list
    $scope.reloadClinicList = function() {
        $http.get($scope.config.endPoint).success(function(data, status, headers, config) {
            // Bind countries to return value    
            $scope.clinics = data;
        });
    }

    // Loads/Reloads country list
    $scope.reloadCountryList = function() {
        $http.get( $scope.config.endPointCountry ).success(function(data, status, headers, config) {
            // Bind countries to return value    
            $scope.countries = data;
        });
    } 

    // Brings up modal to modify clinic information
    $scope.modify = function(clinic) {
        $scope.openModal(clinic, $scope.config.modify);
    }

    // Brings up modal to insert new clinic
    $scope.new = function() {
        $scope.openModal('', $scope.config.new);
    }

    // Delete a clinic
    $scope.delete = function(clinic) {
        var url = $scope.config.endPoint;

        // Add clinic_id if modifying
        url += clinic.clinic_id + '/';

        // Ajax call to post to clinic information
        $http({
            url: url,
            method: "DELETE",
            data: {} // nada here
        })
        .then(function(response) {
            if (response.data.status != 'fail') {
                // Reload clinic list on success
                $scope.reloadClinicList();

                // Display deleted message
                LowStockService.displayFlashMessage('Clinic deleted: ' + clinic.name + ' at country ' + clinic.country_name);
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to delete clinic: ' + clinic.name);
        });
    }

    // Open the modal
    $scope.openModal = function(clinic, action) {
        // Initialise ui-bootstrap model on modify() event
        var modalClinic = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: $scope.config.templateUrl, // the html template to parse selected clinic
            controller: $scope.config.controller, // the controller to handle selected clinic
            size: $scope.config.modalSize, // size of modal
            resolve: { // send through dependencies to modal controller
                clinic: function() {
                    return clinic;
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
        modalClinic.result.then(function(action) {
            // Reload clinic list on success
            $scope.reloadClinicList();

            // Display deleted/updated message
            if(action == $scope.config.new) {
                LowStockService.displayFlashMessage('Clinic added');
            } else {
                LowStockService.displayFlashMessage('Clinic modfied: ' + clinic.name);
            }
        }, function() {
            // Log messaging for debug purpose
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    // Load initial list
    $scope.reloadClinicList();
    $scope.reloadCountryList();
}

angular
    .module('RDash')
    .controller('ModalClinicCtrl', ['$scope', '$modalInstance', '$http', 'clinic', 'action', 'config', 'countries', ModalClinicCtrl]);

function ModalClinicCtrl($scope, $modalInstance, $http, clinic, action, config, countries) {
    // Update action description
    $scope.action = action;

    // Set selected clinic to modal passed through
    $scope.selected = clinic;

    // Set countries to modal passed through
    $scope.countries = countries;

    // Event for inserting/updating a clinic
    $scope.ok = function() {
        var msg = '';

        // Validation
        if($scope.selected.name === '') {
            msg += 'Clinic name cannot be empty\n';
        }

        // Only insert/update if no errors
        if(msg == '') {
            var url = config.endPoint;

            // Add clinic_id if modifying
            if (clinic.hasOwnProperty('clinic_id')) {
                url += clinic.clinic_id + '/';
            }

            // Ajax call to post to clinic information
            $http({
                url: url,
                method: "POST",
                data: {
                    'clinic': $scope.selected
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
                alert('Failed to insert/update clinic');
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