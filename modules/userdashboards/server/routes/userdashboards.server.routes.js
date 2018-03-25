'use strict';

/**
 * Module dependencies
 */
var userdashboardsPolicy = require('../policies/userdashboards.server.policy'),
  userdashboards = require('../controllers/userdashboards.server.controller');

module.exports = function(app) {
  // Userdashboards Routes
  app.route('/api/userdashboards').all(userdashboardsPolicy.isAllowed)
    .get(userdashboards.list)
    .post(userdashboards.create);

  app.route('/api/userdashboards/:userdashboardId').all(userdashboardsPolicy.isAllowed)
    .get(userdashboards.read)
    .put(userdashboards.update)
    .delete(userdashboards.delete);

  // Finish by binding the Userdashboard middleware
  app.param('userdashboardId', userdashboards.userdashboardByID);
};
