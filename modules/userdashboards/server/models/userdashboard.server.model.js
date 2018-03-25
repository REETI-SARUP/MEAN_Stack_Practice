'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Userdashboard Schema
 */
var UserdashboardSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Userdashboard name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Userdashboard', UserdashboardSchema);
