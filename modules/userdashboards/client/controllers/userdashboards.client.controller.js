(function () {
  'use strict';

  // Userdashboards controller
  angular
    .module('userdashboards')
    .controller('UserdashboardsController', UserdashboardsController);

  UserdashboardsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userdashboardResolve'];

  function UserdashboardsController ($scope, $state, $window, Authentication, userdashboard) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userdashboard = userdashboard;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Userdashboard
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.userdashboard.$remove($state.go('userdashboards.list'));
      }
    }

    // Save Userdashboard
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userdashboardForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.userdashboard._id) {
        vm.userdashboard.$update(successCallback, errorCallback);
      } else {
        vm.userdashboard.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('userdashboards.view', {
          userdashboardId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
