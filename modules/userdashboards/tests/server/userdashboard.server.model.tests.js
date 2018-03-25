'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userdashboard = mongoose.model('Userdashboard');

/**
 * Globals
 */
var user,
  userdashboard;

/**
 * Unit tests
 */
describe('Userdashboard Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      userdashboard = new Userdashboard({
        name: 'Userdashboard Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return userdashboard.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      userdashboard.name = '';

      return userdashboard.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Userdashboard.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
