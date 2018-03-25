'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userdashboard = mongoose.model('Userdashboard'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userdashboard;

/**
 * Userdashboard routes tests
 */
describe('Userdashboard CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Userdashboard
    user.save(function () {
      userdashboard = {
        name: 'Userdashboard name'
      };

      done();
    });
  });

  it('should be able to save a Userdashboard if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userdashboard
        agent.post('/api/userdashboards')
          .send(userdashboard)
          .expect(200)
          .end(function (userdashboardSaveErr, userdashboardSaveRes) {
            // Handle Userdashboard save error
            if (userdashboardSaveErr) {
              return done(userdashboardSaveErr);
            }

            // Get a list of Userdashboards
            agent.get('/api/userdashboards')
              .end(function (userdashboardsGetErr, userdashboardsGetRes) {
                // Handle Userdashboards save error
                if (userdashboardsGetErr) {
                  return done(userdashboardsGetErr);
                }

                // Get Userdashboards list
                var userdashboards = userdashboardsGetRes.body;

                // Set assertions
                (userdashboards[0].user._id).should.equal(userId);
                (userdashboards[0].name).should.match('Userdashboard name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userdashboard if not logged in', function (done) {
    agent.post('/api/userdashboards')
      .send(userdashboard)
      .expect(403)
      .end(function (userdashboardSaveErr, userdashboardSaveRes) {
        // Call the assertion callback
        done(userdashboardSaveErr);
      });
  });

  it('should not be able to save an Userdashboard if no name is provided', function (done) {
    // Invalidate name field
    userdashboard.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userdashboard
        agent.post('/api/userdashboards')
          .send(userdashboard)
          .expect(400)
          .end(function (userdashboardSaveErr, userdashboardSaveRes) {
            // Set message assertion
            (userdashboardSaveRes.body.message).should.match('Please fill Userdashboard name');

            // Handle Userdashboard save error
            done(userdashboardSaveErr);
          });
      });
  });

  it('should be able to update an Userdashboard if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userdashboard
        agent.post('/api/userdashboards')
          .send(userdashboard)
          .expect(200)
          .end(function (userdashboardSaveErr, userdashboardSaveRes) {
            // Handle Userdashboard save error
            if (userdashboardSaveErr) {
              return done(userdashboardSaveErr);
            }

            // Update Userdashboard name
            userdashboard.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userdashboard
            agent.put('/api/userdashboards/' + userdashboardSaveRes.body._id)
              .send(userdashboard)
              .expect(200)
              .end(function (userdashboardUpdateErr, userdashboardUpdateRes) {
                // Handle Userdashboard update error
                if (userdashboardUpdateErr) {
                  return done(userdashboardUpdateErr);
                }

                // Set assertions
                (userdashboardUpdateRes.body._id).should.equal(userdashboardSaveRes.body._id);
                (userdashboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userdashboards if not signed in', function (done) {
    // Create new Userdashboard model instance
    var userdashboardObj = new Userdashboard(userdashboard);

    // Save the userdashboard
    userdashboardObj.save(function () {
      // Request Userdashboards
      request(app).get('/api/userdashboards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userdashboard if not signed in', function (done) {
    // Create new Userdashboard model instance
    var userdashboardObj = new Userdashboard(userdashboard);

    // Save the Userdashboard
    userdashboardObj.save(function () {
      request(app).get('/api/userdashboards/' + userdashboardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userdashboard.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userdashboard with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userdashboards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userdashboard is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userdashboard which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userdashboard
    request(app).get('/api/userdashboards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userdashboard with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userdashboard if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userdashboard
        agent.post('/api/userdashboards')
          .send(userdashboard)
          .expect(200)
          .end(function (userdashboardSaveErr, userdashboardSaveRes) {
            // Handle Userdashboard save error
            if (userdashboardSaveErr) {
              return done(userdashboardSaveErr);
            }

            // Delete an existing Userdashboard
            agent.delete('/api/userdashboards/' + userdashboardSaveRes.body._id)
              .send(userdashboard)
              .expect(200)
              .end(function (userdashboardDeleteErr, userdashboardDeleteRes) {
                // Handle userdashboard error error
                if (userdashboardDeleteErr) {
                  return done(userdashboardDeleteErr);
                }

                // Set assertions
                (userdashboardDeleteRes.body._id).should.equal(userdashboardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userdashboard if not signed in', function (done) {
    // Set Userdashboard user
    userdashboard.user = user;

    // Create new Userdashboard model instance
    var userdashboardObj = new Userdashboard(userdashboard);

    // Save the Userdashboard
    userdashboardObj.save(function () {
      // Try deleting Userdashboard
      request(app).delete('/api/userdashboards/' + userdashboardObj._id)
        .expect(403)
        .end(function (userdashboardDeleteErr, userdashboardDeleteRes) {
          // Set message assertion
          (userdashboardDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userdashboard error error
          done(userdashboardDeleteErr);
        });

    });
  });

  it('should be able to get a single Userdashboard that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Userdashboard
          agent.post('/api/userdashboards')
            .send(userdashboard)
            .expect(200)
            .end(function (userdashboardSaveErr, userdashboardSaveRes) {
              // Handle Userdashboard save error
              if (userdashboardSaveErr) {
                return done(userdashboardSaveErr);
              }

              // Set assertions on new Userdashboard
              (userdashboardSaveRes.body.name).should.equal(userdashboard.name);
              should.exist(userdashboardSaveRes.body.user);
              should.equal(userdashboardSaveRes.body.user._id, orphanId);

              // force the Userdashboard to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Userdashboard
                    agent.get('/api/userdashboards/' + userdashboardSaveRes.body._id)
                      .expect(200)
                      .end(function (userdashboardInfoErr, userdashboardInfoRes) {
                        // Handle Userdashboard error
                        if (userdashboardInfoErr) {
                          return done(userdashboardInfoErr);
                        }

                        // Set assertions
                        (userdashboardInfoRes.body._id).should.equal(userdashboardSaveRes.body._id);
                        (userdashboardInfoRes.body.name).should.equal(userdashboard.name);
                        should.equal(userdashboardInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Userdashboard.remove().exec(done);
    });
  });
});
