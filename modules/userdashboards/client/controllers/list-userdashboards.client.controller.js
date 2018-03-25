(function () {
  'use strict';

  angular
    .module('userdashboards')
    .controller('UserdashboardsListController', UserdashboardsListController);

  UserdashboardsListController.$inject = ['UserdashboardsService'];

  function UserdashboardsListController(UserdashboardsService) {
    var vm = this;

    vm.userdashboards = UserdashboardsService.query();
  }
}());
