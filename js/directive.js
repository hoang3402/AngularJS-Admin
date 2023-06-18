import { DOMAIN } from './main';

export function createMovie() {
    return {
        restrict: 'E',
        templateUrl: './table/editAll.html',
        controller: ($scope, $http, $timeout) => {
            console.log('load createMovie');
            $scope.currentGenres = [];
            $scope.status = false;
            // Get genres
            $http({
                method: 'GET',
                url: `${DOMAIN}Genre`
            }).then((res) => {
                $scope.genres = res.data;
            }, (res) => {

            })

            $scope.handleBack = () => {
                var currentUrl = window.location.href;
                var parts = currentUrl.split('#');
                var newUrl = parts[0] + `#!index`;

                window.location.href = newUrl;
            };

            $('#type').on("select2:select", function (e) {
                var selectedOption = e.params.data;
                var optionValue = selectedOption.id;
                var item = $scope.genres.find(i => { return i.name == optionValue })
                $scope.currentGenres.push(item.id)
            });

            $('#type').on('select2:unselect', function (e) {
                var unselectedOption = e.params.data;
                var unselectedOptionId = unselectedOption.id;
                var item = $scope.genres.find(i => { return i.name == unselectedOptionId })
                $scope.currentGenres.splice($scope.currentGenres.indexOf(item.id), 1)
            });

            $('#status').on("select2:select", function (e) {
                var selectedOption = e.params.data;
                var optionValue = selectedOption.id;
                if (optionValue === 'Complete') {
                    $scope.status = true;
                } else {
                    $scope.status = false;
                }
            });
        },
    };
}

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
                url: `${DOMAIN}${$scope.nameTable}ById/${$scope.id}`,
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

                var dataEncode = $.param(data);

                $http({
                    method: 'POST',
                    url: `${DOMAIN}update${$scope.nameTable}/${$scope.id}`,
                    data: dataEncode,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
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
                    method: 'POST',
                    url: `${DOMAIN}delete${$scope.nameTable}/${$scope.id}`,
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
                url: `${DOMAIN}${$scope.nameTable}ById/1`,
            }).then((res) => {
                $scope.items = [];
                angular.forEach(res.data[0], function (value, key) {
                    $scope.items.push({ key: key, value: '' });
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

                var dataEncode = $.param(data);

                $http({
                    method: 'POST',
                    url: `${DOMAIN}add${$scope.nameTable}`,
                    data: dataEncode,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
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
                url: DOMAIN + $routeParams.name,
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
                            `handleTdClick('${$scope.nameTable
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

            $scope.handleCreate = () => { };
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
