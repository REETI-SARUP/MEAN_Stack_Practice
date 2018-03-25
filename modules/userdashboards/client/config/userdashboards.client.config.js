(function () {
  'use strict';

  angular
    .module('userdashboards')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Userdashboards',
      state: 'userdashboards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'userdashboards', {
      title: 'List Userdashboards',
      state: 'userdashboards.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'userdashboards', {
      title: 'Create Userdashboard',
      state: 'userdashboards.create',
      roles: ['user']
    });
  }
}());
