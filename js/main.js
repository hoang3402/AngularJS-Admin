import 'angular';
import 'angular-route';
import { config } from './route';
import * as directive from './directive';

var app = angular.module('myApp', ['ngRoute']);

export const DOMAIN = 'https://hoang3409.alwaysdata.net/index.php/Admin/';

app.config(config);

app.run(($rootScope) => {
    $rootScope.Success = () => {
        Swal.fire({
            title: 'Alert',
            text: 'Success!',
            icon: 'success',
            showConfirmButton: true,
        });
    };

    $rootScope.Failed = () => {
        Swal.fire({
            title: 'Alert',
            text: 'Failed!',
            icon: 'error',
            showConfirmButton: true,
        });
    };
});

app.directive('navbar', directive.navbar);
app.directive('sideBar', directive.sideBar);
app.directive('datatable', directive.datatable);
app.directive('create', directive.create);
app.directive('edittable', directive.editTable);
app.directive('createMovie', directive.createMovie);
app.directive('editMovie', directive.editMovie);
