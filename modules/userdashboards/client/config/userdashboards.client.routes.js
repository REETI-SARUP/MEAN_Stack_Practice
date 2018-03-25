(function () {
  'use strict';

  angular
    .module('userdashboards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userdashboards', {
        abstract: true,
        url: '/userdashboards',
        template: '<ui-view/>'
      })
      .state('userdashboards.list', {
        url: '',
        templateUrl: 'modules/userdashboards/client/views/list-userdashboards.client.view.html',
        controller: 'UserdashboardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userdashboards List'
        }
      })
      .state('userdashboards.create', {
        url: '/create',
        templateUrl: 'modules/userdashboards/client/views/form-userdashboard.client.view.html',
        controller: 'UserdashboardsController',
        controllerAs: 'vm',
        resolve: {
          userdashboardResolve: newUserdashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Userdashboards Create'
        }
      })
      .state('userdashboards.edit', {
        url: '/:userdashboardId/edit',
        templateUrl: 'modules/userdashboards/client/views/form-userdashboard.client.view.html',
        controller: 'UserdashboardsController',
        controllerAs: 'vm',
        resolve: {
          userdashboardResolve: getUserdashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Userdashboard {{ userdashboardResolve.name }}'
        }
      })
      .state('userdashboards.view', {
        url: '/:userdashboardId',
        templateUrl: 'modules/userdashboards/client/views/view-userdashboard.client.view.html',
        controller: 'UserdashboardsController',
        controllerAs: 'vm',
        resolve: {
          userdashboardResolve: getUserdashboard
        },
        data: {
          pageTitle: 'Userdashboard {{ userdashboardResolve.name }}'
        }
      });
  }

  getUserdashboard.$inject = ['$stateParams', 'UserdashboardsService'];

  function getUserdashboard($stateParams, UserdashboardsService) {
    return UserdashboardsService.get({
      userdashboardId: $stateParams.userdashboardId
    }).$promise;
  }

  newUserdashboard.$inject = ['UserdashboardsService'];

  function newUserdashboard(UserdashboardsService) {
    return new UserdashboardsService();
  }
}());
