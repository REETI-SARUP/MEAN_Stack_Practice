// Userdashboards service used to communicate Userdashboards REST endpoints
(function () {
  'use strict';

  angular
    .module('userdashboards')
    .factory('UserdashboardsService', UserdashboardsService);

  UserdashboardsService.$inject = ['$resource'];

  function UserdashboardsService($resource) {
    return $resource('api/userdashboards/:userdashboardId', {
      userdashboardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
