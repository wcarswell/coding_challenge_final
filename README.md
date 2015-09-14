# Coding challenge
The following web view is the MVP for stock order management system. Technologies utilised is Angular.js for frontend, Twitter Bootstrap for responsive layout and Lumen PHP Framework for backend.

- Lumen was chosing to ensure a RESTful approach with frontend.
- Angular.js was chosen to display new technology learned and double binding nature

Laravel Lumen is a stunningly fast PHP micro-framework for building web applications with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Lumen attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as routing, database abstraction, queueing, and caching.

Documentation for the framework can be found on the [Lumen website](http://lumen.laravel.com/docs).

## Further developement
Lumen repo can be extended to write internal or extern apis.

ie.e

api and api.v2 alongside admin repo

## Demo
http://challenge.opendoorstudio.co.za

## Repository explained
1) .htaccess redirects all incoming http calls for admin repo to index.php via apache rewrite rules

2) index.php creates Lumen application instance and executes the instance
- bootstrap/app.php

3) bootstap/app.php bootstraps all libraries and does the following
- autoload dependencies
- enable DB connection methods
- loads app config file .env
- serves up admin/app/Http/routes.php to handle HTTP routing

4) admin/app/Http/routes.php
- handles all the routes for CRUD requests
- can load either middleware or controllers

5) admin/app/Http/controllers
- handles business logic from routes
- utilises models found in admin/app i.e Product.php to store persistent data

6) resources/views/dashboard.php
- the main view for this project
- loads all static files i.e js, css
- loads angular views

7) public
- All static files including angular views


## .env explained
// sets the database php driver
DB_CONNECTION=mysql 

// sets the database host
DB_HOST=localhost

// sets the database port
DB_PORT=3306

// sets the database name
DB_DATABASE=stock_management

// sets the database user
DB_USERNAME=root

// sets the database password
DB_PASSWORD=root

// sets the setting to determine what the minimum quantity on hand is to be considered low stock
LOW_STOCK=5

// the apps caching driver
CACHE_DRIVER=database

// the apps session driver
SESSION_DRIVER=database

// the apps processing queue driver
QUEUE_DRIVER=database

## Included
- Lumen repo with front views
- MySQL workbench db diagram (admin->docs)
- sql scipt(admin-docs)

## Not Included in this MVP - for MVP phase 2
- Validation on Forms
- Admin login
- Admin regstration
- Invoice to Patient
- Automation on low stock email to procurement manager.

## Theme base on Rdash Angular
## Responsive, bloat free, bootstrap powered admin style dashboard!
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rdash/rdash-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

rdash-angular is an AngularJS implementation of the RDash admin dashboard. The dashboard uses a small number of modules to get you started, along with some handy directives and controllers to speed up development using the dashboard.

## Usage
### Requirements
* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)

### Installation
1. Clone the repository: `git clone https://github.com/rdash/rdash-angular.git`
2. Install the NodeJS dependencies: `sudo npm install`.
3. Install the Bower dependencies: `bower install`.
4. Run the gulp build task: `gulp build`.
5. Run the gulp default task: `gulp`. This will build any changes made automatically, and also run a live reload server on [http://localhost:8888](http://localhost:8888).

Ensure your preferred web server points towards the `dist` directory.

