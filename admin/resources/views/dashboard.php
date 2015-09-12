<!doctype html>
<html lang="en" ng-app="RDash">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Stock Management System v2</title>
    <!-- STYLES -->
    <!-- build:css lib/css/main.min.css -->
    <link rel="stylesheet" type="text/css" href="../../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="../../bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="../../bower_components/rdash-ui/dist/css/rdash.css">
    <!-- endbuild -->

    <!-- SCRIPTS -->
    <!-- build:js lib/js/main.min.js -->
    <script type="text/javascript" src="../../bower_components/angular/angular.min.js"></script>
    <script type="text/javascript" src="../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
    <script type="text/javascript" src="../../bower_components/angular-cookies/angular-cookies.min.js"></script>
    <script type="text/javascript" src="../../bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <!-- endbuild -->

    <!-- Custom Scripts -->
    <script type="text/javascript" src="public/admin/js/dashboard.min.js"></script>
</head>

<body ng-controller="MasterCtrl">
    <div id="page-wrapper" ng-class="{'open': toggle}" ng-cloak>

        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <ul class="sidebar">
                <li class="sidebar-main">
                    <a ng-click="toggleSidebar()">
                        SMS v2
                        <span class="menu-icon glyphicon glyphicon-transfer"></span>
                    </a>
                </li>
                <li class="sidebar-title">
                    <span>NAVIGATION</span>
                </li>
                <li class="sidebar-list">
                    <a href="#">Dashboard <span class="menu-icon fa fa-tachometer"></span></a>
                </li>
                <li class="sidebar-list">
                    <a href="#/admin">Admin <span class="menu-icon fa fa-table"></span></a>
                </li>
                <li class="sidebar-list">
                    <a href="#/product">Product<span class="menu-icon fa fa-table"></span></a>
                </li>
                <li class="sidebar-list">
                    <a href="#/reports">Reports <span class="menu-icon fa fa-table"></span></a>
                </li>
            </ul>
        </div>
        <!-- End Sidebar -->

        <div id="content-wrapper">
            <div class="page-content">

                <!-- Header Bar -->
                <div class="row header">
                    <div class="col-xs-12">
                        <div class="user pull-right">
                            <div class="item dropdown">
                                <a href="#" class="dropdown-toggle">
                                    <img src="img/avatar.jpg">
                                </a>
                                <ul class="dropdown-menu dropdown-menu-right">
                                    <li class="dropdown-header">
                                        Joe Bloggs
                                    </li>
                                    <li class="divider"></li>
                                    <li class="link">
                                        <a href="#">
                                            Profile
                                        </a>
                                    </li>
                                    <li class="link">
                                        <a href="#">
                                            Menu Item
                                        </a>
                                    </li>
                                    <li class="link">
                                        <a href="#">
                                            Menu Item
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                    <li class="link">
                                        <a href="#">
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="item dropdown" data-ng-controller="AlertsCtrl">
                                <a href="#" class="dropdown-toggle">
                                    <i class="fa fa-bell-o" ng-class="{'red-alert':alerts.length>0}"> {{ alerts.length }}</i>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-right">
                                    <li class="dropdown-header">
                                        <span ng-show="alerts.lengt>0">Notifications</span>
                                        <span ng-show="alerts.length==0">No new updates</span>
                                    </li>
                                    <li class="divider" ng-show="alerts.lengt>0"></li>
                                    <li data-ng-repeat="alert in alerts">
                                        <a href="#/product">{{ alert.msg }}</a>
                                    </li>
                                    <!-- <li>
                                        <a href="#">Server Down!</a>
                                    </li> -->
                                </ul>
                            </div>
                        </div>
                        <div class="meta">
                            <div class="page">
                                {{ $state.current.topName }}
                            </div>
                            <div class="breadcrumb-links">
                                {{ $state.current.path }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End Header Bar -->

                <!-- Main Content -->
                <div ui-view></div>

            </div>
            <!-- End Page Content -->
        </div>
        <!-- End Content Wrapper -->
    </div>
    <!-- End Page Wrapper -->
</body>

</html>
