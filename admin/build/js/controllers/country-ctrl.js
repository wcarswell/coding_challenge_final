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
    .controller('CountryCtrl', ['$scope', '$state', '$http', '$modal', '$log', 'LowStockService', CountryCtrl]);

function CountryCtrl($scope, $state, $http, $modal, $log, LowStockService) {
	// Controller configs
    $scope.config = {
    	'new': 'Add Country',  // modal new description
    	'modify': 'Modify Country', // modal modify description
    	'deleteAction': 'Are you sure you want to delete this Country?',
    	'modalSize': 'sm', // modal size
    	'templateUrl': 'country.html', // template view to parse modal scope
    	'templateUrlDelete': 'country-delete.html', // delete view to parse to modal scope
    	'controller': 'ModalCountryCtrl', // modal controller
    	'controllerDelete': 'ModalCountryCtrlDelete', // modal delete controller
    	'endPoint': '/admin/country/' // endpoint for country
    }

    // Set the default sort type
	$scope.sortType     = 'name';

	// Set the default sort order
  	$scope.sortReverse  = false;  // set the default sort order
	
	// Store the selected model to update
	$scope.selected = '';
	
	// Set the state of navigation		
	$scope.$state = $state;
	
	// Loads/Reloads country list
	$scope.reloadCountryList = function() {
		$http.get( $scope.config.endPoint ).success(function(data, status, headers, config) {
			// Bind countries to return value    
			$scope.countries = data;
		});
	}	
	
	// Brings up modal to modify country information
	$scope.modify = function(country) {
		$scope.openModal(country, $scope.config.modify);
	}

	// Brings up modal to insert new country
	$scope.new = function() {
		$scope.openModal('', $scope.config.new);
	}

	// Delete a country
	$scope.delete = function(country) {
		// Initialise ui-bootstrap model on modify() event
		var modalCountryDelete = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: $scope.config.templateUrlDelete, // the html template to parse selected country
			controller:  $scope.config.controllerDelete, // the controller to handle selected country
			size: $scope.config.modalSize, // size of modal
			resolve: { // send through dependencies to modal
				country: function() {
					return country;
				},
				config: function() {
					return $scope.config;
				}
			}
		});
		
		// Bind callback functions for save/cancel button
		modalCountryDelete.result.then(function() {
			// Reload country list on success
			$scope.reloadCountryList();

			// Display deleted message
			LowStockService.displayFlashMessage('Country setup deleted: ' + country.name);
		}, function() {
			// Log messaging for debug purpose
			$log.info('Modal dismissed at: ' + new Date());
		});
	}

	// Open the modal
	$scope.openModal = function(country, action) {
		// Initialise ui-bootstrap model on modify() event
		var modalCountry = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: $scope.config.templateUrl, // the html template to parse selected country
			controller:  $scope.config.controller, // the controller to handle selected country
			size: $scope.config.modalSize, // size of modal
			resolve: { // send through dependencies to modal
				country: function() {
					return country;
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
		modalCountry.result.then(function(action) {
			// Reload country list on success
			$scope.reloadCountryList();

			// Display deleted/updated message
			if(action == $scope.config.new) {
				LowStockService.displayFlashMessage('Country added');
			} else {
				LowStockService.displayFlashMessage('Country modfied: ' + country.name);
			}
		}, function() {
			// Log messaging for debug purpose
			$log.info('Modal dismissed at: ' + new Date());
		});
	}
	
	// Load initial list
	$scope.reloadCountryList();
}

/**
 * @ngdoc function
 * @name RDash.controller:ModalCountryCtrl
 * @description
 * # ModalCountryCtrl
 * Modal for inserting/modirying country
 */
angular
    .module('RDash')
    .controller('ModalCountryCtrl', ['$scope', '$modalInstance', '$http', 'country', 'action', 'config', ModalCountryCtrl]);

function ModalCountryCtrl($scope, $modalInstance, $http, country, action, config) {
	// Update action description
	$scope.action = action;
		
	// Set selected country to modal passed through
    $scope.selected = country;

	// Event for inserting/updating a country
    $scope.ok = function() {
    	var msg = '';

    	// Validation
    	if($scope.selected.name === '') {
    		msg += 'Country name cannot be empty\n';
    	}

    	if($scope.selected.currency === '') {
    		msg += 'Currency name cannot be empty\n';
    	}

    	// Only insert/update if no errors
    	if(msg == '') {

	    	var url = config.endPoint;

	    	// Add country_id if modifying
	    	if( country.hasOwnProperty('country_id') ) {
	    		url += country.country_id + '/';
	    	}

			// Ajax call to post to country information
	        $http({
				url: url,
				method: "POST",
				data: {
					'country': $scope.selected
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
				alert('Failed to insert/update country');
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

/**
 * @ngdoc function
 * @name RDash.controller:ModalCountryCtrlDelete
 * @description
 * # ModalCountryCtrlDelete
 * Modal for deleting country
 */
angular
    .module('RDash')
    .controller('ModalCountryCtrlDelete', ['$scope', '$modalInstance', '$http', 'country', 'config', ModalCountryCtrlDelete]);

function ModalCountryCtrlDelete($scope, $modalInstance, $http, country, config) {
	// Update action description
	$scope.deleteAction = config.deleteAction;
		
	// Event for inserting/updating a country
    $scope.ok = function() {
		var url = config.endPoint;
    	url += country.country_id + '/';
    	
		// Ajax call to post to country information
        $http({
			url: url,
			method: "DELETE",
			data: {} // nada here
		})
		.then(function(response) {
			if (response.data.status != 'fail') {
				$modalInstance.close();
			} else {
				// Alert user on any errors
				alert(response.data.message);
			}
		},
		function(response) { // optional
			// Inserting/Updating has failed, alert user
			alert('Failed to delete country: ' + country.name);
		});
    };
	
	// Event to dismiss modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}