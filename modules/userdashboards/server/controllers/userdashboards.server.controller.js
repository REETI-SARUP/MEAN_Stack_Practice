'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Userdashboard = mongoose.model('Userdashboard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Userdashboard
 */
exports.create = function(req, res) {
  var userdashboard = new Userdashboard(req.body);
  userdashboard.user = req.user;

  userdashboard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userdashboard);
    }
  });
};

/**
 * Show the current Userdashboard
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var userdashboard = req.userdashboard ? req.userdashboard.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userdashboard.isCurrentUserOwner = req.user && userdashboard.user && userdashboard.user._id.toString() === req.user._id.toString();

  res.jsonp(userdashboard);
};

/**
 * Update a Userdashboard
 */
exports.update = function(req, res) {
  var userdashboard = req.userdashboard;

  userdashboard = _.extend(userdashboard, req.body);

  userdashboard.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userdashboard);
    }
  });
};

/**
 * Delete an Userdashboard
 */
exports.delete = function(req, res) {
  var userdashboard = req.userdashboard;

  userdashboard.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userdashboard);
    }
  });
};

/**
 * List of Userdashboards
 */
exports.list = function(req, res) {
  Userdashboard.find().sort('-created').populate('user', 'displayName').exec(function(err, userdashboards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userdashboards);
    }
  });
};

/**
 * Userdashboard middleware
 */
exports.userdashboardByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Userdashboard is invalid'
    });
  }

  Userdashboard.findById(id).populate('user', 'displayName').exec(function (err, userdashboard) {
    if (err) {
      return next(err);
    } else if (!userdashboard) {
      return res.status(404).send({
        message: 'No Userdashboard with that identifier has been found'
      });
    }
    req.userdashboard = userdashboard;
    next();
  });
};
