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
    .controller('ClinicCtrl', ['$scope', '$state', '$http', '$modal', '$log', ClinicCtrl]);

function ClinicCtrl($scope, $state, $http, $modal, $log) {

    // Controller configs
    $scope.config = {
        'new': 'Add Clinic', // modal new description
        'modify': 'Modify Clinic', // modal modify description
        'modalSize': 'sm', // modal size
        'templateUrl': 'clinic.html', // template view to parse modal scope
        'controller': 'ModalClinicCtrl', // modal controller
        'endPoint': '/admin/clinic/', // endpoint for clinic
        'endPointCountry': '/admin/country/' // endpoint for country
    }

    // Store the selected model to update
    $scope.selected = '';

    // Set the state of navigation    
    $scope.$state = $state;

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
        modalClinic.result.then(function(selectedItem) {
            // Reload clinic list on success
            $scope.reloadClinicList();
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
                $modalInstance.close();
            } else {
                // Alert user on any errors
                alert(response.data.message);
            }
        },
        function(response) { // optional
            // Inserting/Updating has failed, alert user
            alert('Failed to insert/update clinic');
        });
    };

    // Event to dismiss modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}