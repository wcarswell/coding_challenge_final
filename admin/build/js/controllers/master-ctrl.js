'use strict';

/**
 * @ngdoc function
 * @name RDash.controller:MasterCtrl
 * @description
 * # MasterCtrl
 * Master controller to handle the entire system
 */
angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$state', '$http', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $state, $http) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    
    // Set the state of navigation   
    $scope.$state = $state;

    // Set the system name
    $scope.systemName = 'SMS v2'

    // Initialise variable to store messaging
    $scope.flashMessage = '';

    // Set the breakpoint for mobilew view to hide menu
    var mobileView = 992;

    // Get the width of the device
    $scope.getWidth = function() {
        return window.innerWidth;
    };

    // Store the selected model to update
    $scope.selected = '';

    // Watch the with, and hide once it enters mobile view
    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    // Event for showing and hiding menu
    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };  

    // Event for catching the broadcast message from different controllers
    $scope.$on('displayFlashMessage', function(events, args) {
        $scope.displayFlashMessage(args.msg);
    });

    // Event for updating messaging
    $scope.displayFlashMessage = function(msg) {
        $scope.flashMessage = msg;
    }

    // Rebuild scope on window resize
    window.onresize = function() {
        $scope.$apply();
    };
}

/**
 * @ngdoc function
 * @name yapp.controller:LowStockService
 * @description
 * # LowStockService
 * Service to disseminate broadcasting messages between controllers
 */
angular.module('RDash')
    .factory('LowStockService', ['$rootScope', LowStockService]);

function LowStockService($rootScope) {
    // Initialise shared service variable
    var sharedService = {};

    // Broadcast to reload stock alert function
    sharedService.reloadLowStockAlert = function() {
        $rootScope.$broadcast('reloadLowStockAlert');
    }

    // Broadcast to update flash message
    sharedService.displayFlashMessage = function(msg) {
        $rootScope.$broadcast('displayFlashMessage', { msg: msg });
    }

    return sharedService;
}