(function () {
  'use strict';

  describe('Userdashboards Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserdashboardsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserdashboardsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserdashboardsService = _UserdashboardsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userdashboards');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userdashboards');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserdashboardsController,
          mockUserdashboard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userdashboards.view');
          $templateCache.put('modules/userdashboards/client/views/view-userdashboard.client.view.html', '');

          // create mock Userdashboard
          mockUserdashboard = new UserdashboardsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userdashboard Name'
          });

          // Initialize Controller
          UserdashboardsController = $controller('UserdashboardsController as vm', {
            $scope: $scope,
            userdashboardResolve: mockUserdashboard
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userdashboardId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userdashboardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userdashboardId: 1
          })).toEqual('/userdashboards/1');
        }));

        it('should attach an Userdashboard to the controller scope', function () {
          expect($scope.vm.userdashboard._id).toBe(mockUserdashboard._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userdashboards/client/views/view-userdashboard.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserdashboardsController,
          mockUserdashboard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('userdashboards.create');
          $templateCache.put('modules/userdashboards/client/views/form-userdashboard.client.view.html', '');

          // create mock Userdashboard
          mockUserdashboard = new UserdashboardsService();

          // Initialize Controller
          UserdashboardsController = $controller('UserdashboardsController as vm', {
            $scope: $scope,
            userdashboardResolve: mockUserdashboard
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userdashboardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/userdashboards/create');
        }));

        it('should attach an Userdashboard to the controller scope', function () {
          expect($scope.vm.userdashboard._id).toBe(mockUserdashboard._id);
          expect($scope.vm.userdashboard._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/userdashboards/client/views/form-userdashboard.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserdashboardsController,
          mockUserdashboard;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('userdashboards.edit');
          $templateCache.put('modules/userdashboards/client/views/form-userdashboard.client.view.html', '');

          // create mock Userdashboard
          mockUserdashboard = new UserdashboardsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userdashboard Name'
          });

          // Initialize Controller
          UserdashboardsController = $controller('UserdashboardsController as vm', {
            $scope: $scope,
            userdashboardResolve: mockUserdashboard
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userdashboardId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userdashboardResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userdashboardId: 1
          })).toEqual('/userdashboards/1/edit');
        }));

        it('should attach an Userdashboard to the controller scope', function () {
          expect($scope.vm.userdashboard._id).toBe(mockUserdashboard._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/userdashboards/client/views/form-userdashboard.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
