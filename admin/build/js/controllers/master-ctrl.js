/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$state', '$http', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $state, $http) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    
    // Set the state of navigation   
    $scope.$state = $state;
    
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    // Store the selected model to update
    $scope.selected = '';

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

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    

    window.onresize = function() {
        $scope.$apply();
    };
}

angular.module('RDash')
    .factory('LowStockService', ['$rootScope', LowStockService]);

function LowStockService($rootScope) {
    var sharedService = {};

    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.reloadLowStockAlert = function() {
        $rootScope.$broadcast('reloadLowStockAlert');
    }

    return sharedService;
}