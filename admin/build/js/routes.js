'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'public/admin/templates/dashboard.html'
            })
            .state('tables', {
                url: '/tables',
                templateUrl: 'public/admin/tables.html'
            });
    }
]);
