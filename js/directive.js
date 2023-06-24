import { DOMAIN } from './main';

export function editTable() {
    return {
        restrict: 'E',
        templateUrl: './table/editTable.html',
        controller: ($scope, $routeParams, $http, $rootScope) => {
            console.log('EditTable');
            $scope.nameTable = $routeParams.name;
            $scope.id = $routeParams.id;
            $http({
                method: 'GET',
                url: `${DOMAIN}api/${$scope.nameTable}/${$scope.id}`,
            }).then((res) => {
                $scope.items = []; // Khởi tạo một mảng rỗng để lưu trữ các mục

                angular.forEach(res.data[0], function (value, key) {
                    $scope.items.push({ key: key, value: value });
                });
                $scope.items.shift();
            });

            $scope.handleSave = () => {
                console.log('Save');
                var data = {};
                for (var i = 0; i < $scope.items.length; i++) {
                    var key = $scope.items[i].key;
                    var value = $scope.items[i].value;
                    data[key] = value;
                }

                $http({
                    method: 'PUT',
                    url: `${DOMAIN}api/${$scope.nameTable}/${$scope.id}`,
                    data: data,
                })
                    .then(function (response) {
                        console.log(`response:`, response);
                        $rootScope.Success();
                    })
                    .catch(function (error) {
                        $rootScope.Failed();
                    });
            };

            $scope.handleDelete = () => {
                $http({
                    method: 'DELETE',
                    url: `${DOMAIN}api/${$scope.nameTable}/${$scope.id}`,
                })
                    .then(function (response) {
                        console.log(`response:`, response);
                        $scope.back();
                        $rootScope.Success();
                    })
                    .catch(function (error) {
                        $rootScope.Failed();
                    });
            };

            $scope.back = () => {
                var currentUrl = window.location.href;
                var urlParts = currentUrl.split('/');
                urlParts.pop();
                var newUrl = urlParts.join('/');
                window.location.href = newUrl;
            };
        },
    };
}

export function create() {
    return {
        restrict: 'E',
        templateUrl: './table/editTable.html',
        controller: ($scope, $routeParams, $http, $rootScope) => {
            $scope.nameTable = $routeParams.name;

            $http({
                method: 'GET',
                url: `${DOMAIN}api/${$scope.nameTable}/1`,
            }).then((res) => {
                $scope.items = [];
                angular.forEach(res.data[0], function (value, key) {
                    $scope.items.push({ key: key, value: '' });
                });
            });

            $scope.handleSave = () => {
                console.log('Save');
                var data = {};
                for (var i = 0; i < $scope.items.length; i++) {
                    var key = $scope.items[i].key;
                    var value = $scope.items[i].value;
                    data[key] = value;
                }

                $http({
                    method: 'POST',
                    url: `${DOMAIN}api/${$scope.nameTable}`,
                    data: data,
                })
                    .then(function (response) {
                        console.log(`response:`, response);
                        $rootScope.Success();
                    })
                    .catch(function (error) {
                        $rootScope.Failed();
                    });
            };

            $scope.handleDelete = () => {
                var currentUrl = window.location.href;
                var parts = currentUrl.split('#');
                var newUrl = parts[0] + `#!/table/${$scope.nameTable}`;

                window.location.href = newUrl;
            };
        },
    };
}

export function datatable($routeParams) {
    return {
        restrict: 'E',
        templateUrl: './table/table.html',
        controller: ($scope, $http) => {
            console.log('Datatable');
            $scope.nameTable = $routeParams.name;
            $http({
                method: 'GET',
                url: `${DOMAIN}api/${$routeParams.name}`,
            }).then((res) => {
                $scope.data = res.data;

                var theadRow = angular.element('#example1 thead tr');
                var tfootRow = angular.element('#example1 tfoot tr');
                angular.forEach($scope.data[0], function (value, key) {
                    var th = angular.element('<th>').text(key);
                    var clonedTh = th.clone();
                    tfootRow.append(th);
                    theadRow.append(clonedTh);
                });

                var tbody = angular.element('#example1 tbody');
                angular.forEach($scope.data, function (item) {
                    var tr = angular.element('<tr>');
                    angular.forEach(item, function (value, key) {
                        var temp = JSON.stringify(value);
                        var td = angular
                            .element('<td>')
                            .text(
                                temp.length > 100
                                    ? temp.substring(1, 100) + '...'
                                    : value
                            );
                        tr.attr(
                            'onclick',
                            `handleTdClick('${
                                $scope.nameTable
                            }',${JSON.stringify(item)})`
                        );
                        tr.append(td);
                    });
                    tbody.append(tr);
                });

                $scope.setupTable();
            });

            $scope.setupTable = () => {
                $('#example1')
                    .DataTable({
                        responsive: true,
                        lengthChange: true,
                        autoWidth: false,
                        buttons: [
                            'copy',
                            'csv',
                            'excel',
                            'pdf',
                            'print',
                            'colvis',
                        ],
                    })
                    .buttons()
                    .container()
                    .appendTo('#example1_wrapper .col-md-6:eq(0)');
            };
        },
    };
}

export function navbar() {
    return {
        restrict: 'E',
        templateUrl: './navbar/navbar.html',
        controller: () => {
            console.log('load navbar');
        },
    };
}

export function sideBar() {
    return {
        restrict: 'E',
        templateUrl: './sidebar/sidebar.html',
        controller: () => {
            console.log('load sideBar');
        },
    };
}
