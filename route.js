app.config(function ($routeProvider) {
	$routeProvider.when('/table/:name/:id', {
		template: '<edittable></edittable>',
	});
	$routeProvider.when('/table/:name', {
		template: '<datatable></datatable>',
	});
	$routeProvider.when('/create/:name', {
		template: '<create></create>',
	});
	$routeProvider.when('/create-movie', {
		template: '<create-movie></create-movie>',
	});
	$routeProvider.otherwise({
		template: '<h1 class="text-center">Hello Admin</h1>',
	});
});
