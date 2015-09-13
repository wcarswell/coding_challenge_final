'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/admin');

        // Application routes
        $stateProvider
            .state('tables', {
                url: '/tables',
                templateUrl: 'public/admin/tables.html'
            })
            .state('admin', {
                url: '/admin',
                topName: 'Admin Setup',
                path: 'Home / Admin',
                templateUrl: '/public/admin/templates/admin.html'
            })
            .state('country', {
                url: '/country',
                topName: 'Country Setup',
                templateUrl: '/public/admin/templates/admin/country.html',
                controller: 'CountryCtrl'
            })
            .state('clinic', {
                url: '/clinic',
                topName: 'Clinic Setup',
                templateUrl: '/public/admin/templates/admin/clinic.html',
                controller: 'ClinicCtrl'
            })
            .state('order', {
                url: '/order',
                templateUrl: '/public/admin/templates/order.html',
                controller: 'OrderCtrl'
            })
            .state('tax', {
                url: '/tax',
                templateUrl: '/public/admin/templates/admin/tax.html',
                controller: 'TaxCtrl'
            })
            .state('vendor', {
                url: '/vendor',
                templateUrl: '/public/admin/templates/admin/vendor.html',
                controller: 'VendorCtrl'
            })
            .state('reports', {
                url: '/reports',
                templateUrl: '/public/admin/templates/reports.html'
            })
            .state('low_stock', {
                url: '/low_stock',
                templateUrl: '/public/admin/templates/reports/low-stock.html',
                controller: 'LowStockCtrl'
            })
            .state('product', {
                url: '/product',
                templateUrl: '/public/admin/templates/product.html',
                controller: 'ProductCtrl'
            });
    }
]);